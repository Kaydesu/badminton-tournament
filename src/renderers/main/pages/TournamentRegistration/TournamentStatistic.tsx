import React, { FC, useEffect, useMemo, useState } from 'react';
import { StatisticLayout, StatisticStyled } from './styled'
import { Link, useNavigate } from 'react-router-dom';
import caretLine from '../../../../assets/icons/caret-line.svg';
import Icon from '@components/Icon';
import ParticipantList from './ParticipantList';
import Input from '@components/Input';
import { Select } from 'antd';
import Button from '@components/Button';
import { TeamSchema } from '@data/Team';
import { AthleteSchema } from '@data/Athlete';
import { CompeteMember, Content, TournamentSchema } from '@data/Tournament';
import { Sex } from '@utils/types';
import { useToastAction } from '@components/Toast';

interface TeamOptions {
    id: string;
    name: string;
    members: string[];
}

const Option = Select.Option;

const { fetch, fetchBatch } = window.Api;

const initialTeam: TeamOptions = {
    id: '',
    name: '',
    members: [],
}

const initialMember = {
    id: '',
    name: '',
}

type Props = {
    activeContent: Content;
    tournament: TournamentSchema;
    registerNewMember: (name: string, member: CompeteMember) => Promise<void>;
    registerNewTeam: (name: string, member: CompeteMember) => Promise<void>;
    deleteMember: (name: string, team: string) => void;
    handleUpdateRank: (memberName: string, teamName: string, dir: 'up' | 'down') => void;
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

    const [teamList, setTeamList] = useState<TeamOptions[]>([]);
    const [memberList, setMemberList] = useState<AthleteSchema[]>([]);

    const [currentTeam, setCurrentTeam] = useState(initialTeam);
    const [currentMember, setCurrentMember] = useState([
        initialMember,
        initialMember,
    ]);

    const [info, setInfo] = useState<{
        email: string;
        phone: string;
    }>({
        email: '',
        phone: ''
    });

    // useEffect:
    useEffect(() => {
        getTeamOptions();
    }, []);

    useEffect(() => {
        if (currentTeam.id) {
            getMemberList();
        }
    }, [currentTeam.id]);



    /*=================================Common:==============================*/

    const getTeamOptions = () => {
        fetch<TeamSchema[]>('TEAMS').then(res => {
            setTeamList(res.map(team => ({
                id: team.id,
                name: team.teamName,
                members: team.members,
            })))
        })
    }

    const getMemberList = () => {
        fetchBatch<AthleteSchema>('ATHLETES', currentTeam.members).then(res => {
            setMemberList(res);
        })
    }

    const getSex = (): Sex => {
        switch (activeContent) {
            case Content.MAN_SINGLE:
                return 'MALE';
            case Content.WOMAN_SINGLE:
                return 'FEMALE';
        }
    }

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

    /*=================================Team related:==============================*/
    const handleSearchTeam = (e: string) => {
        let value;
        if (currentTeam.name.length === 1 && e === '') {
            value = '';
        } else {
            value = e === '' ? currentTeam.name : e;
        }
        setCurrentTeam({
            ...currentTeam,
            name: value,
        });
    }

    const handleSelectTeam = (id: string) => {
        if (id !== '') {
            const instance = teamList.find(item => item.id === id);
            setCurrentTeam({ ...instance });
        }
    }

    const teamOptions = useMemo(() => {
        return teamList.map(teamInfo => (
            <Option key={teamInfo.id} value={teamInfo.id}>
                {teamInfo.name}
            </Option>
        ))
    }, [teamList]);
    /*=================================Member related:==============================*/
    const handleSearchMember = (e: string, index: number) => {
        let value;
        if (currentMember[index].name.length === 1 && e === '') {
            value = '';
        } else {
            value = e === '' ? currentMember[index].name : e;
        }

        const newMembers = JSON.parse(JSON.stringify(currentMember));

        newMembers[index] = {
            ...newMembers[index],
            name: value,
        }

        setCurrentMember(newMembers);
    }

    const handleSelectMember = (id: string, index: number) => {
        if (id !== '') {
            const instance = memberList.find(item => item.id === id);

            const newMembers = JSON.parse(JSON.stringify(currentMember));

            newMembers[index] = {
                ...newMembers[index],
                id: instance.id,
                name: instance.name,
            }
            setCurrentMember(newMembers);
        }
    }

    const athleteOptions = useMemo(() => {
        const filterByGender: {
            male: JSX.Element[];
            female: JSX.Element[];
        } = {
            male: [],
            female: [],
        }

        if (currentTeam.id === '') {
            filterByGender.male = null;
            filterByGender.female = null;
        } else {
            filterByGender.male = memberList.map(member => member.sex === 'MALE' && (
                <Option key={member.id} value={member.id}>
                    {member.name}
                </Option>
            ));

            filterByGender.female = memberList.map(member => member.sex === 'FEMALE' && (
                <Option key={member.id} value={member.id}>
                    {member.name}
                </Option>
            ))
        }

        return filterByGender;
    }, [memberList]);


    /** ===================================== Call API==================================== */

    const register = () => {
        const errors: string[] = [];

        if (activeContent === Content.MAN_DOUBLE ||
            activeContent === Content.WOMAN_DOUBLE ||
            activeContent === Content.MIXED_DOUBLE) {
            if (!currentTeam.name || !currentMember[0].name || !currentMember[1].name) {
                !currentTeam.name && errors.push('Không được bỏ trống tên đội');
                !currentMember[0].name || !currentMember[1].name && errors.push('Không được bỏ trống tên vận động viên');
                setToastVisible(true);
                setToastContent(errors, 'error');
                return;
            }

            if (currentMember[0].name.length < 6 || currentMember[1].name.length < 6) {
                errors.push('Tên phải có ít nhất 6 ký tự');
                setToastVisible(true);
                setToastContent(errors, 'error');
                return;
            }
        } else {
            if (!currentTeam.name || !currentMember[0].name) {
                !currentTeam.name && errors.push('Không được bỏ trống tên đội');
                !currentMember[0].name && errors.push('Không được bỏ trống tên vận động viên');
                setToastVisible(true);
                setToastContent(errors, 'error');
                return;
            }
            if (currentMember[0].name.length < 6) {
                errors.push('Tên phải có ít nhất 6 ký tự');
                setToastVisible(true);
                setToastContent(errors, 'error');
                return;
            }
        }

        // Check if the team exist in teamList
        const team = competeTeams.find(item => item.name === currentTeam.name);
        const newMember = {
            name: '',
            phone: info.phone,
            email: info.email,
            created: new Date().getTime(),
            seedRank: 0,
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

            registerNewMember(currentTeam.name, newMember).then(() => {
                clearAll();
                setToastVisible(true);
                setToastContent(['Đăng ký thành công'], 'success');
            })
        } else {
            registerNewTeam(currentTeam.name, newMember).then(() => {
                clearAll();
                setToastVisible(true);
                setToastContent(['Đăng ký thành công'], 'success');
            })
        }
    }

    const clearAll = () => {
        setCurrentTeam({ ...initialTeam });
        setCurrentMember([
            { ...initialMember },
            { ...initialMember },
        ]);
        setInfo({
            email: '',
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
        <StatisticStyled>
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
                            <div className="info-field__input">
                                <Select
                                    showSearch
                                    optionFilterProp='children'
                                    searchValue={currentTeam.name}
                                    value={currentTeam.id}
                                    onSearch={handleSearchTeam}
                                    onChange={handleSelectTeam}
                                >
                                    {teamOptions}
                                </Select>
                            </div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">Tên</div>
                            <div className="info-field__input">
                                {
                                    activeContent === Content.MAN_SINGLE || activeContent === Content.WOMAN_SINGLE ? (
                                        <Select
                                            showSearch
                                            optionFilterProp='children'
                                            searchValue={currentMember[0].name}
                                            value={currentMember[0].id}
                                            onSearch={(e) => handleSearchMember(e, 0)}
                                            onChange={(e) => handleSelectMember(e, 0)}
                                        >
                                            {getSex() === 'MALE' ? athleteOptions.male : athleteOptions.female}
                                        </Select>
                                    ) : activeContent === Content.MAN_DOUBLE ? (
                                        <>
                                            <Select
                                                className='double'
                                                showSearch
                                                optionFilterProp='children'
                                                searchValue={currentMember[0].name}
                                                value={currentMember[0].id}
                                                onSearch={(e) => handleSearchMember(e, 0)}
                                                onChange={(e) => handleSelectMember(e, 0)}
                                            >
                                                {athleteOptions.male}
                                            </Select>
                                            <Select
                                                className='double'
                                                showSearch
                                                optionFilterProp='children'
                                                value={currentMember[1].id}
                                                searchValue={currentMember[1].name}
                                                onSearch={(e) => handleSearchMember(e, 1)}
                                                onChange={(e) => handleSelectMember(e, 1)}
                                            >
                                                {athleteOptions.male}
                                            </Select>
                                        </>
                                    ) : activeContent === Content.WOMAN_DOUBLE ? (
                                        <>
                                            <Select
                                                className='double'
                                                showSearch
                                                optionFilterProp='children'
                                                searchValue={currentMember[0].name}
                                                value={currentMember[0].id}
                                                onSearch={(e) => handleSearchMember(e, 0)}
                                                onChange={(e) => handleSelectMember(e, 0)}
                                            >
                                                {athleteOptions.female}
                                            </Select>
                                            <Select
                                                className='double'
                                                showSearch
                                                optionFilterProp='children'
                                                searchValue={currentMember[1].name}
                                                value={currentMember[1].id}
                                                onSearch={(e) => handleSearchMember(e, 1)}
                                                onChange={(e) => handleSelectMember(e, 1)}
                                            >
                                                {athleteOptions.female}
                                            </Select>
                                        </>
                                    ) : (
                                        <>
                                            <Select
                                                className='double'
                                                showSearch
                                                optionFilterProp='children'
                                                searchValue={currentMember[0].name}
                                                value={currentMember[0].id}
                                                onSearch={(e) => handleSearchMember(e, 0)}
                                                onChange={(e) => handleSelectMember(e, 0)}
                                            >
                                                {athleteOptions.male}
                                            </Select>
                                            <Select
                                                className='double'
                                                showSearch
                                                optionFilterProp='children'
                                                searchValue={currentMember[1].name}
                                                value={currentMember[1].id}
                                                onSearch={(e) => handleSearchMember(e, 1)}
                                                onChange={(e) => handleSelectMember(e, 1)}
                                            >
                                                {athleteOptions.female}
                                            </Select>
                                        </>
                                    )
                                }

                            </div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">E-mail</div>
                            <div className="info-field__input"><Input value={info.email} name="email" onChange={onInfoChange} /></div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">Số điện thoại</div>
                            <div className="info-field__input"><Input value={info.phone} type='number' name="phone" onChange={onInfoChange} /></div>
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