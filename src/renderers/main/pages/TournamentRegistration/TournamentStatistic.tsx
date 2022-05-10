import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { StatisticLayout, StatisticStyled } from './styled'
import { Link, useNavigate } from 'react-router-dom';
import caretLine from '../../../../assets/icons/caret-line.svg';
import Icon from '@components/Icon';
import ParticipantList from './ParticipantList';
import Input from '@components/Input';
import Button from '@components/Button';
import { CompeteMember, Content, TournamentSchema } from '@data/Tournament';
import { useToastAction } from '@components/Toast';

interface TeamOptions {
    id: string;
    name: string;
    symbol: string;
    members: string[];
}

const initialTeam: TeamOptions = {
    id: '',
    name: '',
    symbol: '',
    members: [],
}

const initialMember = {
    id: '',
    name: '',
}

type Props = {
    activeContent: Content;
    tournament: TournamentSchema;
    registerNewMember: (name: string, member: CompeteMember, symbol?: string) => Promise<void>;
    registerNewTeam: (name: string, member: CompeteMember, symbol?: string) => Promise<void>;
    deleteMember: (name: string, team: string) => void;
    handleUpdateRank: (memberName: string, teamName: string) => void;
}

const TournamentStatistic: FC<Props> = ({
    activeContent,
    tournament,
    registerNewMember,
    registerNewTeam,
    deleteMember,
    handleUpdateRank
}) => {

    const navigate = useNavigate();
    const { setToastVisible, setToastContent } = useToastAction();

    const [currentTeam, setCurrentTeam] = useState(initialTeam);
    const [currentMember, setCurrentMember] = useState([
        initialMember,
        initialMember,
    ]);

    const [currentTab, setCurrentTab] = useState('all');

    const [info, setInfo] = useState<{
        yearOfBirth: number;
        phone: string;
    }>({
        yearOfBirth: null,
        phone: ''
    });

    const teamNameRef = useRef(null);
    const teamSymbolRef = useRef(null);

    useEffect(() => {
        if (currentTab !== 'all') {
            const symbol = competeTeams.find(team => team.name === currentTab).symbol;
            setCurrentTeam({ ...currentTeam, symbol });
        } else {
            setCurrentTeam({ ...initialTeam });
        }
    }, [currentTab]);

    /*=================================Common:==============================*/

    const onInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInfo({
            ...info,
            [e.target.name]: e.target.value,
        })
    }

    const competeTeams = useMemo(() => {
        switch (activeContent) {
            case Content.MAN_SINGLE:
                return tournament.menSingle.teams;
            case Content.WOMAN_SINGLE:
                return tournament.womenSingle.teams;
            case Content.MAN_DOUBLE:
                return tournament.menDouble.teams;
            case Content.WOMAN_DOUBLE:
                return tournament.womenDouble.teams;
            case Content.MIXED_DOUBLE:
                return tournament.mixedDouble.teams;
            default:
                return [];
        }
    }, [tournament, activeContent]);

    /** ===================================== Call API==================================== */

    const register = () => {
        const errors: string[] = [];
        const teamName = teamNameRef.current.value;
        const symbol = teamSymbolRef.current.value;

        if (activeContent === Content.MAN_DOUBLE ||
            activeContent === Content.WOMAN_DOUBLE ||
            activeContent === Content.MIXED_DOUBLE) {
            if (!teamName || !currentMember[0].name || !currentMember[1].name) {
                !teamName && errors.push('Không được bỏ trống tên đội');
                if (!currentMember[0].name || !currentMember[1].name) {
                    errors.push('Không được bỏ trống tên vận động viên');
                }
                setToastVisible(true);
                setToastContent(errors, 'error');
                return;
            }
        } else {
            if (!teamName || !currentMember[0].name) {
                !teamName && errors.push('Không được bỏ trống tên đội');
                !currentMember[0].name && errors.push('Không được bỏ trống tên vận động viên');
                setToastVisible(true);
                setToastContent(errors, 'error');
                return;
            }
        }

        // Check if the team exist in teamList
        const team = competeTeams.find(item => item.name === teamName);
        const newMember = {
            name: '',
            phone: info.phone,
            yearOfBirth: info.yearOfBirth ? info.yearOfBirth.toString() : '',
            // yearOfBirth: info.yearOfBirth.toString(),
            created: new Date().getTime(),
            seeded: false,
        }

        if (activeContent === Content.MAN_DOUBLE ||
            activeContent === Content.WOMAN_DOUBLE ||
            activeContent === Content.MIXED_DOUBLE) {
            newMember.name = `${currentMember[0].name} - ${currentMember[1].name}`
        } else {
            newMember.name = currentMember[0].name;
        }

        if (team) {
            const memberIndex = team.members.findIndex(member => member.name === newMember.name);
            if (memberIndex > -1) {
                setToastVisible(true);
                setToastContent(['Thành viên đã đăng ký'], 'error');
                return
            }

            registerNewMember(teamName, newMember, symbol).then(() => {
                clearAll();
                setToastVisible(true);
                setToastContent(['Đăng ký thành công'], 'success');
            })
        } else {
            registerNewTeam(teamName, newMember, symbol).then(() => {
                clearAll();
                setToastVisible(true);
                setToastContent(['Đăng ký thành công'], 'success');
            })
        }
    }

    const handleChangeTeam = (e: any, bol: number) => {
        if (bol === 0) {
            setCurrentTeam({
                ...currentTeam,
                name: e.target.value,
            })
        } else {
            setCurrentTeam({
                ...currentTeam,
                symbol: e.target.value.toUpperCase(),
            })
        }
    }

    const handleChangeMember = (e: any, index: number) => {
        const temp = JSON.parse(JSON.stringify(currentMember));
        temp[index].name = e.target.value;
        setCurrentMember(temp);
    }

    const clearAll = () => {
        if (currentTab === 'all') {
            setCurrentTeam({ ...initialTeam });
        }
        setCurrentMember([
            { ...initialMember },
            { ...initialMember },
        ]);
        setInfo({
            yearOfBirth: null,
            phone: '',
        });
    }

    const checkValidPariticipants = () => {
        let min = 100;

        if (tournament.menSingle.enabled) {
            let sum = 0;
            tournament.menSingle.teams.map(team => {
                sum += team.members.length;
            });
            if (sum < min) {
                min = sum;
            }
        }

        if (tournament.menDouble.enabled) {
            let sum = 0;
            tournament.menDouble.teams.map(team => {
                sum += team.members.length;
            });
            if (sum < min) {
                min = sum;
            }
        }

        if (tournament.womenSingle.enabled) {
            let sum = 0;
            tournament.womenSingle.teams.map(team => {
                sum += team.members.length;
            });
            if (sum < min) {
                min = sum;
            }
        }

        if (tournament.womenDouble.enabled) {
            let sum = 0;
            tournament.womenDouble.teams.map(team => {
                sum += team.members.length;
            });
            if (sum < min) {
                min = sum;
            }
        }

        if (tournament.mixedDouble.enabled) {
            let sum = 0;
            tournament.mixedDouble.teams.map(team => {
                sum += team.members.length;
            });
            if (sum < min) {
                min = sum;
            }
        }

        if (min < 4) {
            setToastVisible(true);
            setToastContent(['Nội dung phải có ít nhất 4 vận động viên'], 'error');
            return
        }

        navigate(`/tournament/match/${tournament.id}`);
    }

    return (
        <StatisticStyled className='tambo-scrollbar'>
            <div className='header'>
                <button onClick={() => navigate('/')} >
                    <div className='redirect'>
                        <Icon src={caretLine} />
                        Trang chủ
                    </div>
                </button>
                <button onClick={checkValidPariticipants}>
                    <div className='redirect redirect--foward'>
                        Thi đấu
                        <Icon src={caretLine} />
                    </div>
                </button>
            </div>
            <StatisticLayout>
                <div className="top">
                    <div className="registration">
                        <h2 className="section-title">Ghi danh</h2>
                        <div className="info-field">
                            <div className="info-field__label">Đội</div>
                            <div className="info-field__input info-field__input--team">
                                <Input ref={teamNameRef}
                                    value={currentTab === 'all' ? currentTeam.name : currentTab}
                                    onChange={(e) => handleChangeTeam(e, 0)}
                                />
                                <Input ref={teamSymbolRef}
                                    maxLength={4}
                                    value={currentTeam.symbol}
                                    onChange={(e) => handleChangeTeam(e, 1)}
                                />
                            </div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">Tên</div>
                            <div className={`info-field__input ${activeContent === Content.MAN_DOUBLE || activeContent === Content.WOMAN_DOUBLE || activeContent === Content.MIXED_DOUBLE ? 'info-field__input--double' : ''}`}>
                                {
                                    activeContent === Content.MAN_SINGLE || activeContent === Content.WOMAN_SINGLE ? (
                                        <Input value={currentMember[0].name} onChange={(e) => handleChangeMember(e, 0)} />
                                    ) : (
                                        <>
                                            <Input value={currentMember[0].name} onChange={(e) => handleChangeMember(e, 0)} />
                                            <span className='separator'> - </span>
                                            <Input value={currentMember[1].name} onChange={(e) => handleChangeMember(e, 1)} />
                                        </>
                                    )
                                }

                            </div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">Năm Sinh</div>
                            <div className="info-field__input">
                                <Input
                                    type='number'
                                    value={info.yearOfBirth || ''}
                                    name="yearOfBirth"
                                    onChange={onInfoChange}
                                />
                            </div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">Số điện thoại</div>
                            <div className="info-field__input">
                                <Input
                                    value={info.phone}
                                    type='number'
                                    name="phone"
                                    onChange={onInfoChange}
                                />
                            </div>
                        </div>
                        <div className="info-field info-field--submit">
                            <Button onClick={register}>Đăng ký</Button>
                            <Button onClick={clearAll} buttonType='secondary'>Xóa</Button>
                        </div>
                    </div>
                    <div className="tournament-info">
                        <h2 className="section-title">Thống kê</h2>
                        <div className="info-field">
                            <div className="info-field__label">Vận động viên:</div>
                            <div className="info-field__input">
                                {
                                    function () {
                                        let sum = 0;
                                        competeTeams.map((item, _) => {
                                            sum += item.members.length;
                                        })
                                        return sum;
                                    }()
                                }
                            </div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">Đội:</div>
                            <div className="info-field__input">{competeTeams.length}</div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <ParticipantList
                        currentTab={currentTab}
                        setCurrentTab={(e) => setCurrentTab(e)}
                        handleUpdateRank={handleUpdateRank}
                        handleDelete={deleteMember}
                        competeTeams={competeTeams}
                    />
                </div>
            </StatisticLayout>
        </StatisticStyled >
    )
}

export default TournamentStatistic