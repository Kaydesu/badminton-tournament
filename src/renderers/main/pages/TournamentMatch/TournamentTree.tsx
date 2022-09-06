import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { CompeteMember } from '@data/Tournament';
import { formatNumber, paddingLeft, paddingTop } from '@utils/constants';
import { generateRandom, getBaseLog, isOdd, matchBeforeOppose, splitArray, suffleList } from '@utils/math';
import { ControlPanel, ImageContainer, NameContainer, Pagination, SeedTable, Staging, TreeContainer } from './styled';
import TournamentBracket from './Tree';
import chevron from '../../../../assets/icons/chevron-double-right.svg';
import caret from '../../../../assets/icons/caret-down.svg';
import Icon from '@components/Icon';
import Button from '@components/Button';
import { useAutoSave } from './useAutoSave';

type Props = {
    branchName: string;
    participantsList: Participant[];
    start: number;
    ready: boolean;
    teamList: string[];
    resetResult: () => void;
    previewResult: () => void;
    printMatch: () => void;
    saveResult: () => void;
}

enum PHASE {
    WAITING = 'waiting',
    SEEDING = 'seeding',
    GROUPING = 'grouping',
    FINISH = 'finish'
}

type StageProps = {
    title: string;
    disabled: boolean;
}

type Participant = {
    name: string;
    slot: number;
    seeded: boolean;
    prior: boolean;
    team: string;
    symbol: string;
    created: number;
}

type Ballot = {
    id: number;
    ballot: number;
    taken: string;
    belongToTeam: string;
    isPlayoff: boolean;
    isValid: boolean;
    position: { x: number; y: number };
}

const StageComponent: FC<StageProps> = ({ children, title, disabled }) => {
    return (
        <Staging disabled={disabled}>
            <div className="title">
                <Icon src={chevron} />
                {title}
            </div>
            <div className="contents">
                {children}
            </div>
        </Staging>
    )
}


const TournamentTree: FC<Props> = ({
    branchName,
    participantsList,
    start,
    ready,
    teamList,
    resetResult,
    previewResult,
    printMatch,
    saveResult
}) => {
    const [pickAthleteDisabled, setPickAthleteDisabled] = useState(false);
    const [currentPhase, setCurrentPhase] = useAutoSave<PHASE>('currentPhase', branchName, PHASE.SEEDING);
    const [teamCounter, setTeamCounter] = useAutoSave('teamCounter', branchName, 0);
    const [participants, setParticipants] = useAutoSave<Participant[]>('participants', branchName, []);
    const [validBallots, setValidBallots] = useAutoSave<number[]>('validBallots', branchName, []);
    const [ballots, setBallots] = useAutoSave<Ballot[]>('ballots', branchName, []);

    const [currentAthlete, setCurrentAthlete] = useState<Participant>({
        name: '',
        team: '',
        symbol: '',
        created: 0,
        prior: false,
        seeded: false,
        slot: null,
    });
    const [matches, setMatches] = useState<{
        id: number;
        position: { x: number; y: number };
    }[]>([]);
    const [activeTaken, setActiveTaken] = useState('');

    const participantsRef = useRef<Participant[]>([]);
    const ballotsRef = useRef<Ballot[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        TournamentBracket.initialize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight,
            'tree-container'
        );
    }, []);

    useEffect(() => {
        if (participantsList.length > 0) {
            initializeTree();
        }
    }, [participantsList]);

    useEffect(() => {
        validateBallot();
    }, [currentPhase, ballots, teamCounter]);

    const initializeTree = () => {
        if (participants.length === 0) {
            setParticipants(participantsList);
            participantsRef.current = JSON.parse(JSON.stringify(participantsList));
        } else {
            participantsRef.current = JSON.parse(JSON.stringify(participants));
        }

        const total = participantsList.length;
        TournamentBracket.createLevels(total);
        TournamentBracket.render();

        if (ballots.length === 0) {
            const defaultBallots = TournamentBracket.generateBallots().map(item => ({
                ...item,
                isValid: false,
                taken: null,
                belongToTeam: null
            }));
            ballotsRef.current = JSON.parse(JSON.stringify(defaultBallots));
            setBallots(JSON.parse(JSON.stringify(defaultBallots)));
        } else {
            setBallots(JSON.parse(JSON.stringify(ballots)));
        }
        // Load from file or generate default
        setMatches(TournamentBracket.generateMatchIds(total));
    }

    const getClassName = useCallback((athlete: Participant) => {
        let className = '';
        if (athlete.slot) {
            className += 'done';
        }
        if (athlete.name === currentAthlete.name) {
            className += ' selected';
        }

        return className;
    }, [currentAthlete]);

    const pickAthlete = useCallback((list: Participant[]) => {
        setPickAthleteDisabled(true);
        let pickedAthletes = list.filter(item => !item.slot);
        const interval = setInterval(() => {
            const filtered = list.filter(item => !item.slot);
            const randomAthlete = filtered[Math.floor(Math.random() * filtered.length)];
            setCurrentAthlete(randomAthlete);
        }, 50);

        setTimeout(() => {
            setPickAthleteDisabled(false);
            clearInterval(interval);
        }, pickedAthletes.length > 1 ? 500 : 50);
    }, []);


    const validateBallot = () => {
        if (currentPhase === PHASE.SEEDING) {
            setValidBallots([]);
        } else if (currentPhase === PHASE.GROUPING) {
            const takenSlots = ballots.filter(item => item.belongToTeam === teamList[teamCounter]);
            if (takenSlots.length === 0) {
                let newValidBallots = ballots.filter(item => !Boolean(item.taken)).map(item => item.id);
                setValidBallots(newValidBallots);
                return;
            }
            let maximum = 0;
            let distances = ballots.map(item => {
                let matches: number[] = [];
                takenSlots.map(taken => {
                    matches.push(
                        matchBeforeOppose(
                            TournamentBracket.findNextMatches(item.ballot - 1),
                            TournamentBracket.findNextMatches(taken.ballot - 1)
                        )
                    )
                });
                const sum = matches.reduce((a, b) => a + b, 0);
                const avg = (sum / matches.length) || 0;
                if (avg >= maximum) {
                    maximum = avg;
                }
                return avg;
            });

            // Check for how many left?
            const notTaken = ballots.filter((item) => !Boolean(item.taken)).map(item => item.id);
            if (notTaken.length !== 1) {
                let newValidBallots = ballots.filter((_, index) => distances[index] >= maximum)
                    .filter((item) => !Boolean(item.taken))
                    .map(item => item.id);
                if (newValidBallots.length === 0) {
                    setValidBallots(notTaken);
                } else {
                    setValidBallots(newValidBallots);
                }
                return;
            }
            setValidBallots(notTaken);
        }
    }

    const selectPosition = (athlete: Participant) => {
        const validPosition = ballots.filter(item => validBallots.includes(item.id));
        let selected: Ballot = null;
        const interval = setInterval(() => {
            selected = validPosition[Math.floor(Math.random() * validPosition.length)];
            if (selected) {
                const newBallots: Ballot[] = ballots.map(item => {
                    if (item.id === selected.id) {
                        return {
                            ...item,
                            taken: athlete.name + `[${athlete.symbol || athlete.team}]`,
                            belongToTeam: athlete.team,
                        }
                    } else {
                        return item;
                    }
                });
                setBallots(newBallots);
            }
        }, 50);

        setTimeout(() => {
            if (selected) {
                const newParticipants = participants.map(item => {
                    if (athlete.name === item.name) {
                        return {
                            ...item,
                            slot: selected.id,
                        }
                    } else {
                        return { ...item }
                    }
                });

                setParticipants(newParticipants);
                setCurrentAthlete({
                    name: '',
                    team: '',
                    symbol: '',
                    created: 0,
                    prior: false,
                    seeded: false,
                    slot: null,
                });
            }
            clearInterval(interval);
        }, validPosition.length > 1 ? 2000 : 50);
    }

    const getPhaseLabel = useCallback(() => {
        switch (currentPhase) {
            case PHASE.SEEDING:
                return '1. Bóc thăm xếp hạt giống';
            case PHASE.GROUPING:
                return '2. Bóc thăm theo đội';
            case PHASE.FINISH:
                return '3. Kết thúc'
        }
    }, [currentPhase]);

    const matchLabel = useMemo(() => {
        const handleDragEnd = (e: React.DragEvent<HTMLDivElement>, ballot: Ballot) => {
            e.currentTarget.classList.remove('drag-enter');
            const seeded = JSON.parse(e.dataTransfer.getData('seeded')) as Participant;
            const newBallots: Ballot[] = ballots.map(item => {
                if (item.id === ballot.id) {
                    return {
                        ...item,
                        taken: `${seeded.name}[${seeded.symbol || seeded.team}]`,
                        belongToTeam: seeded.team
                    }
                } else {
                    return item;
                }
            });
            setBallots(newBallots);

            const newParticipants = participants.map(item => {
                if (seeded.name === item.name) {
                    return {
                        ...item,
                        slot: ballot.id,
                    }
                } else {
                    return { ...item }
                }
            });

            setParticipants(newParticipants);
        }

        const getTakenTeam = (name: string) => {
            if (!name) {
                return '';
            }
            return name.split('[')[1].replace(']', '')
        }

        return <NameContainer>
            {
                ballots.map(item => (
                    <div
                        style={{
                            left: item.position.x + paddingLeft,
                            top: item.position.y + paddingTop,
                        }}
                        // className='match-id'
                        className={`match-id ${validBallots.includes(item.id) ? 'valid' : ''}`}
                        key={item.id}
                    >
                        {item.id}
                    </div>
                ))
            }
            {
                matches.map(item => (
                    <div
                        style={{
                            left: item.position.x + paddingLeft,
                            top: item.position.y + paddingTop,
                        }}
                        className="match-id"
                        key={item.id + "-" + "matches"}
                    >
                        {formatNumber(item.id)}
                    </div>
                ))
            }
            {
                ballots.length > 0 && ballots.map((item) => currentPhase === PHASE.SEEDING ? (
                    <div
                        onDrop={(e) => handleDragEnd(e, item)}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.currentTarget.classList.add('drag-enter')}
                        onDragLeave={(e) => e.currentTarget.classList.remove('drag-enter')}
                        // onMouseEnter={(e) => {
                        //     e.preventDefault();
                        //     setActiveTaken(`${getTakenTeam(item.taken)}`)
                        // }}
                        // onMouseLeave={(e) => {
                        //     e.preventDefault();
                        //     setActiveTaken('');
                        // }}
                        style={{
                            left: item.position.x + paddingLeft,
                            top: item.position.y + paddingTop,
                        }}
                        // className={`athlete-name${activeTaken === getTakenTeam(item.taken) ? 'active' : ''}`}
                        className="athlete-name"
                        key={item.id + "-" + "name"}
                    >
                        {item.taken}
                    </div>
                ) : (
                    <div
                        onMouseEnter={(e) => {
                            e.preventDefault();
                            setActiveTaken(`${getTakenTeam(item.taken)}`)
                        }}
                        onMouseLeave={(e) => {
                            e.preventDefault();
                            setActiveTaken('');
                        }}
                        style={{
                            left: item.position.x + paddingLeft,
                            top: item.position.y + paddingTop,
                        }}
                        className={`athlete-name ${activeTaken === getTakenTeam(item.taken) ? 'active' : ''}`}
                        key={item.id + "-" + "name"}
                    >
                        {item.taken}
                    </div>
                ))
            }
        </NameContainer>
    }, [ballots, matches, currentPhase, validBallots, activeTaken]);

    const generateContent = useMemo(() => {

        const next = () => {
            if (currentPhase === PHASE.SEEDING) {
                setCurrentPhase(PHASE.GROUPING);
                ballotsRef.current = JSON.parse(JSON.stringify(ballots));
                participantsRef.current = JSON.parse(JSON.stringify(participants));
            } else if (currentPhase === PHASE.GROUPING) {
                ballotsRef.current = JSON.parse(JSON.stringify(ballots));
                participantsRef.current = JSON.parse(JSON.stringify(participants));
                if (teamCounter < teamList.length - 1) {
                    setTeamCounter(teamCounter + 1);
                } else {
                    setCurrentPhase(PHASE.FINISH);
                }
            }
        }

        const redo = () => {
            setParticipants(participantsRef.current);
            setBallots(ballotsRef.current);
        }

        let abstractList: Participant[] = [];
        switch (currentPhase) {
            case PHASE.SEEDING:
                abstractList = participants.filter(item => item.seeded);
                break;
            case PHASE.GROUPING:
                abstractList = participants.filter(item => item.team === teamList[teamCounter]);
                break;
            default:
                break;
        }

        const allRegistered = abstractList.filter(item => item.slot !== null).length === abstractList.length;

        return abstractList.length > 0 ? (<SeedTable>
            <div className='table-header'>
                {currentPhase === PHASE.SEEDING ? 'Vận động viên hạt giống' : `Đội ${teamList[teamCounter]}`}
            </div>
            <ul className='seeded-list'>
                {
                    abstractList.map(item => {
                        return <li
                            className={getClassName(item) + ' priority'}
                            key={item.name + '-athlete'}
                            draggable={!item.slot}
                            onDragStart={(e) => {
                                e.dataTransfer.setData('seeded', JSON.stringify(item));
                            }}
                        >
                            {item.name} _ {item.team}
                        </li>

                    })
                }
            </ul>
            {
                allRegistered ?
                    <div className="actions">
                        <Button
                            buttonType='secondary'
                            onClick={next}
                        >
                            Tiếp tục
                        </Button>
                        <Button
                            buttonType='secondary'
                            onClick={redo}
                        >
                            Làm lại
                        </Button>
                    </div> :
                    <div className="actions">
                        <Button
                            buttonType='secondary'
                            disabled={pickAthleteDisabled || allRegistered || currentPhase === PHASE.SEEDING}
                            onClick={() => pickAthlete(abstractList)}
                        >
                            Chọn VĐV
                        </Button>
                        <Button
                            buttonType='secondary'
                            onClick={() => selectPosition(currentAthlete)}
                            disabled={!currentAthlete.name || pickAthleteDisabled}
                        >
                            Chọn vị trí
                        </Button>
                    </div>
            }
        </SeedTable>
        ) : (
            <>
                <Button className='result-button' onClick={previewResult}>
                    Xem kết quả
                </Button>
                <Button className='result-button' onClick={printMatch}>
                    In kết quả
                </Button>
            </>
        )
    }, [participants, currentAthlete, pickAthleteDisabled, currentPhase, teamCounter]);

    return (
        <>
            <TreeContainer ref={containerRef} id="tree-container">
                {matchLabel}
            </TreeContainer>

            {
                ready && ReactDOM.createPortal(
                    <ControlPanel>
                        <StageComponent disabled title={getPhaseLabel()}>
                            {generateContent}
                        </StageComponent>
                        <div className='setting-field'>
                            <Button buttonType='main' onClick={saveResult}>Lưu kết quả</Button>
                            <Button buttonType='main' onClick={resetResult}>Hủy kết quả</Button>
                        </div>
                    </ControlPanel>
                    ,
                    document.getElementById('control-panel')
                )
            }
        </>
    );
}

export default TournamentTree