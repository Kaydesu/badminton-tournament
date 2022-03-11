import React, { FC, useEffect, useMemo, useState } from 'react'
import { StatisticLayout, StatisticStyled } from './styled'
import { Link } from 'react-router-dom'
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
}

const TournamentStatistic: FC<Props> = ({ activeContent, tournament, registerNewMember, registerNewTeam }) => {

    const { setToastVisible, setToastContent } = useToastAction();

    const [teamList, setTeamList] = useState<TeamOptions[]>([]);
    const [memberList, setMemberList] = useState<AthleteSchema[]>([]);

    const [currentTeam, setCurrentTeam] = useState(initialTeam);
    const [currentMember, setCurrentMember] = useState(initialMember);

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
    const handleSearchMember = (e: string) => {
        let value;
        if (currentMember.name.length === 1 && e === '') {
            value = '';
        } else {
            value = e === '' ? currentMember.name : e;
        }
        setCurrentMember({
            ...currentMember,
            name: value,
        });
    }

    const handleSelectMember = (id: string) => {
        if (id !== '') {
            const instance = memberList.find(item => item.id === id);
            setCurrentMember({
                id: instance.id,
                name: instance.name,
            });
        }
    }

    const athleteOptions = useMemo(() => {
        if (currentTeam.id === '') {
            return null;
        } else {
            return memberList.map(member => member.sex === getSex() && (
                <Option key={member.id} value={member.id}>
                    {member.name}
                </Option>
            ))
        }
    }, [memberList]);


    /** ===================================== Call API==================================== */

    const register = () => {
        const errors: string[] = [];
        if (currentTeam.name === '' || currentMember.name === '') {
            !currentTeam.name && errors.push('Không được bỏ trống tên đội')
            !currentMember.name && errors.push('Không được bỏ trống tên vận động viên')
            setToastVisible(true);
            setToastContent(errors, 'error');
            return;
        }

        // Check if the team exist in teamList
        const team = competeTeams.find(item => item.name === currentTeam.name);
        const newMember = {
            name: currentMember.name,
            phone: info.phone,
            email: info.email,
        }
        if (team) {
            const memberIndex = team.members.findIndex(member => member.name === newMember.name);
            if (memberIndex > -1) {
                setToastVisible(true);
                setToastContent(['Thành viên đã đăng ký'], 'error');
                return
            }

            registerNewMember(currentTeam.name, newMember).then(() => {
                setToastVisible(true);
                setToastContent(['Đăng ký thành công'], 'success');
            })
        } else {
            registerNewTeam(currentTeam.name, newMember).then(() => {
                setToastVisible(true);
                setToastContent(['Đăng ký thành công'], 'success');
            })
        }
    }

    const clearAll = () => {

    }

    return (
        <StatisticStyled>
            <div className='header'>
                <Link to='/' >
                    <div className='redirect'>
                        <Icon src={caretLine} />
                        Trang chủ
                    </div>
                </Link>
                <Link to='/'>
                    <div className='redirect redirect--foward'>
                        Thi đấu
                        <Icon src={caretLine} />
                    </div>
                </Link>
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
                                <Select
                                    showSearch
                                    optionFilterProp='children'
                                    searchValue={currentMember.name}
                                    onSearch={handleSearchMember}
                                    onChange={handleSelectMember}
                                >
                                    {athleteOptions}
                                </Select>
                            </div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">E-mail</div>
                            <div className="info-field__input"><Input /></div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">Số điện thoại</div>
                            <div className="info-field__input"><Input type='number' /></div>
                        </div>
                        <div className="info-field info-field--submit">
                            <Button onClick={register}>Đăng ký</Button>
                            <Button buttonType='secondary'>Xóa</Button>
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
                    <ParticipantList competeTeams={competeTeams} />
                </div>
            </StatisticLayout>
        </StatisticStyled >
    )
}

export default TournamentStatistic