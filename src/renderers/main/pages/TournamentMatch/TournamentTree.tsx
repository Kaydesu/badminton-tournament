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

type Props = {
    participantsList: Participant[];
    start: number;
    ready: boolean;
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


const TournamentTree: FC<Props> = ({ participantsList, start, ready }) => {
    const [pickAthleteDisabled, setPickAthleteDisabled] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [matchBase64, setMatchBase64] = useState(null);
    const [currentPhase, setCurrentPhase] = useState<PHASE>(PHASE.SEEDING);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [validBallots, setValidBallots] = useState<number[]>([]);
    const [currentAthlete, setCurrentAthlete] = useState<Participant>({
        name: '',
        team: '',
        symbol: '',
        created: 0,
        prior: false,
        seeded: false,
        slot: null,
    });
    const [ballots, setBallots] = useState<Ballot[]>([]);
    const [matches, setMatches] = useState<{
        id: number;
        position: { x: number; y: number };
    }[]>([]);

    useEffect(() => {
        TournamentBracket.initialize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight,
            'tree-container'
        );
    }, []);

    useEffect(() => {
        if (participantsList.length > 0) {
            setParticipants(participantsList);
            const total = participantsList.length;
            TournamentBracket.createLevels(total);
            TournamentBracket.render();
            setBallots(TournamentBracket.generateBallots().map(item => ({ ...item, isValid: false, taken: null })));
            setMatches(TournamentBracket.generateMatchIds(total));
        }
    }, [participantsList]);

    useEffect(() => {
        validateBallot();
    }, [currentPhase, ballots]);

    useEffect(() => {
        if (start) {
            // if (participantList.left.length > 0) {
            //     const suffle = suffleList(participantList.left);
            //     setLeftTreeResult(getNodePosition(leftTree.current, suffle));
            // }
            // if (participantList.right.length > 0) {
            //     const suffle = suffleList(participantList.right);
            //     setRightTreeResult(getNodePosition(rightTree.current, suffle));
            // }
            // setMatchBase64(null);
            // matching().then(() => {
            //     enableButtons();
            //     const canvas = TournamentBracket.canvas;
            //     const image = canvas.toDataURL("image/png");
            //     setMatchBase64(image);
            // })
        }
    }, [start]);

    const matching = () => {

    }

    const onImageLoad = () => {
    }

    const getColorByName = (name: string, side: 1 | 2) => {

    }

    const phaseOneExcecute = () => {

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
        const interval = setInterval(() => {
            const filtered = list.filter(item => !item.slot);
            const randomAthlete = filtered[Math.floor(Math.random() * filtered.length)];
            setCurrentAthlete(randomAthlete);
        }, 50);

        setTimeout(() => {
            setPickAthleteDisabled(false);
            clearInterval(interval);
        }, 500);
    }, []);


    const validateBallot = useCallback(() => {
        if (currentPhase === PHASE.SEEDING) {
            let priors = ballots.filter(item => !item.isPlayoff).map(item => item.ballot);
            let totalPrior = priors.length;
            let totalTaken = ballots.filter(item => item.taken !== null).length;
            if (totalTaken < totalPrior) {
                // If the number of slots taken is lower than totalPrior slots
                let newValidBallots = ballots.filter(item => !item.isPlayoff && !item.taken).map(item => item.ballot);
                setValidBallots(newValidBallots);
            } else if (totalTaken === totalPrior) {
                // If all the prior slots are already taken
                // Find the maximum match number before meet an already taken slot
                let maximum = 0;

                let distances = ballots.map(item => {
                    let matches: number[] = [];
                    priors.map(priorSlot => {
                        matches.push(
                            matchBeforeOppose(
                                TournamentBracket.findNextMatches(item.ballot - 1),
                                TournamentBracket.findNextMatches(priorSlot - 1)
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

                let newValidBallots = ballots.filter((_, index) => distances[index] >= maximum).map(item => item.ballot);
                setValidBallots(newValidBallots);
            } else {
                setValidBallots([]);
            }
        }
    }, [currentPhase, ballots]);

    const selectPosition = useCallback((athlete: Participant) => {
        const validPosition = ballots.filter(item => validBallots.includes(item.ballot));
        let selected: Ballot = null;
        const interval = setInterval(() => {
            selected = validPosition[Math.floor(Math.random() * validPosition.length)];
            const newBallots: Ballot[] = ballots.map(item => {
                if (item.id === selected.id) {
                    return {
                        ...item,
                        taken: athlete.name + `[${athlete.symbol || athlete.team}]`,
                    }
                } else {
                    return item;
                }
            });
            setBallots(newBallots);
        }, 50);

        setTimeout(() => {
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
            clearInterval(interval);
        }, 500);
    }, [ballots, participants, validBallots]);

    const matchLabel = useMemo(() => {
        const handleDragEnd = (e: React.DragEvent<HTMLDivElement>, ballot: Ballot) => {
            e.currentTarget.classList.remove('drag-enter');
            const priorAthlete = JSON.parse(e.dataTransfer.getData('priorAthlete')) as Participant;
            const newBallots: Ballot[] = ballots.map(item => {
                if (item.id === ballot.id) {
                    return {
                        ...item,
                        taken: `${priorAthlete.name}_${priorAthlete.symbol || priorAthlete.team}`,
                    }
                } else {
                    return item;
                }
            });
            setBallots(newBallots);

            const newParticipants = participants.map(item => {
                if (priorAthlete.name === item.name) {
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

        return <NameContainer>
            {
                ballots.map(item => (
                    <div
                        style={{
                            left: item.position.x + paddingLeft,
                            top: item.position.y + paddingTop,
                        }}
                        // className='match-id'
                        className={`match-id ${validBallots.includes(item.ballot) ? 'valid' : ''}`}
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

                ballots.map((item) => (
                    <div
                        onDrop={(e) => handleDragEnd(e, item)}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.currentTarget.classList.add('drag-enter')}
                        onDragLeave={(e) => e.currentTarget.classList.remove('drag-enter')}
                        style={{
                            left: item.position.x + paddingLeft,
                            top: item.position.y + paddingTop,
                        }}
                        className="athlete-name"
                        key={item.id + "-" + "name"}
                    >
                        {item.taken}
                    </div>
                ))
            }
        </NameContainer>
    }, [ballots, matches, currentPhase, validBallots]);

    const phaseOne = useMemo(() => {
        const abstractList = participants.filter(item => item.seeded);
        const allSeedRegistered = abstractList.filter(item => item.slot !== null).length === abstractList.length;
        const priorAthlete = participants.find(item => item.prior);

        console.log(allSeedRegistered, priorAthlete?.slot);

        return abstractList.length > 0 && <SeedTable>
            <div className='table-header'>Vận động viên hạt giống</div>
            <ul className='seeded-list'>
                {
                    abstractList.map(item => {
                        return <li className={getClassName(item)} key={item.name}>
                            {item.name} _ {item.team}
                            {item.name === currentAthlete.name && <Icon src={caret} />}
                        </li>

                    })
                }
            </ul>
            <div className='table-header'>Vận động viên ưu tiên</div>
            <ul className='seeded-list'>
                <li
                    className={getClassName(priorAthlete) + ' priority'}
                    draggable={!priorAthlete.slot}
                    onDragStart={(e) => {
                        e.dataTransfer.setData('priorAthlete', JSON.stringify(priorAthlete));
                    }}
                >
                    {priorAthlete.name}_{priorAthlete.team}
                </li>
            </ul>
            {
                allSeedRegistered && Boolean(priorAthlete.slot) ?
                    <div className="actions">
                        <Button
                            buttonType='secondary'
                            onClick={() => pickAthlete(abstractList)}
                        >
                            Tiếp tục
                        </Button>
                        <Button
                            buttonType='secondary'
                            onClick={() => {
                                setParticipants(participantsList);
                                setBallots(TournamentBracket.generateBallots().map(item => ({ ...item, isValid: false, taken: null })));
                            }}
                        >
                            Làm lại
                        </Button>
                    </div> :
                    <div className="actions">
                        <Button
                            buttonType='secondary'
                            disabled={pickAthleteDisabled || allSeedRegistered}
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
    }, [participants, currentAthlete, pickAthleteDisabled])

    return (
        <>
            <TreeContainer ref={containerRef} id="tree-container">
                {/* {
                matchBase64 && (
                    <ImageContainer>
                        <img src={matchBase64} alt="lull" onLoad={onImageLoad} />
                    </ImageContainer>
                )
            }
            <NameContainer>
           
            </NameContainer> */}
                {matchLabel}
            </TreeContainer>

            {
                ready && ReactDOM.createPortal(
                    <ControlPanel>
                        <StageComponent disabled title='Bóc thăm xếp hạt giống'>
                            {phaseOne}
                        </StageComponent>
                    </ControlPanel>
                    ,
                    document.getElementById('control-panel')
                )
            }
        </>
    );
}

export default TournamentTree