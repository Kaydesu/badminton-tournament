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
import { Content, TournamentSchema } from '@data/Tournament';
import { Sex } from '@utils/types';

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
}

const TournamentStatistic: FC<Props> = ({ activeContent, tournament }) => {

    const [teamList, setTeamList] = useState<TeamOptions[]>([]);
    const [memberList, setMemberList] = useState<AthleteSchema[]>([]);

    const [currentTeam, setCurrentTeam] = useState(initialTeam);
    const [currentMember, setCurrentMember] = useState(initialMember);

    const [name, setName] = useState<{
        id: string;
        value: string;
    }>({
        id: '',
        value: '',
    });

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
    }, [currentTeam]);



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
    }, [tournament]);

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
        })
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
    const handleSearchName = (e: any) => {

    }

    const handleSelectName = (e: any) => {

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
                                <input type="text" className='hidden-input' />
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
                                    onSearch={handleSearchName}
                                    onChange={handleSelectName}
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
                            <div className="info-field__input"><Input /></div>
                        </div>
                        <div className="info-field info-field--submit">
                            <Button>Đăng ký</Button>
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