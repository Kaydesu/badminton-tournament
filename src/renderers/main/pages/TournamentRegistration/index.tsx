import React, { FC, useEffect, useState } from 'react'
import { CompeteMember, CompeteTeam, Content, TournamentSchema } from '@data/Tournament';
import { useParams } from 'react-router-dom'
import SideBar from './SideBar';
import { Container } from './styled';
import TournamentStatistic from './TournamentStatistic';
import { RadioChangeEvent, Spin } from 'antd';

const { fetch, save } = window.Api;

const TournamentRegistration: FC = () => {

    const match = useParams<{ id: string }>();
    const [activeContent, setActiveContent] = useState<Content>(Content.MAN_SINGLE);

    const [tournament, setTournament] = useState<TournamentSchema>(null);

    useEffect(() => {
        getTournamentInfo();
    }, []);

    const getTournamentInfo = () => {
        fetch<TournamentSchema>('TOURNAMENTS', match.id).then(res => {
            setTournament(res);
        })
    }

    const changeActiveContent = (contentType: Content) => {
        setActiveContent(contentType);
    }

    const handleActiveContent = (name: Content, checked: boolean) => {
        // if (name === 'menSingle') {
        //     return;
        // }
        const newTournament = JSON.parse(JSON.stringify(tournament)) as TournamentSchema;
        switch (name) {
            case Content.MAN_SINGLE:
                newTournament.menSingle.enabled = checked;
                break;
            case Content.WOMAN_SINGLE:
                newTournament.womenSingle.enabled = checked;
                break;
            case Content.MAN_DOUBLE:
                newTournament.menDouble.enabled = checked;
                break;
            case Content.WOMAN_DOUBLE:
                newTournament.womenDouble.enabled = checked;
                break;
            case Content.MIXED_DOUBLE:
                newTournament.mixedDouble.enabled = checked;
                break;
        }

        if (!newTournament.menSingle.enabled &&
            !newTournament.womenSingle.enabled &&
            !newTournament.menDouble.enabled &&
            !newTournament.womenDouble.enabled &&
            !newTournament.mixedDouble.enabled) {
            return;
        }

        if (name === activeContent && checked === false) {
            // Active next available content:
            if (newTournament.menSingle.enabled) {
                setActiveContent(Content.MAN_SINGLE);
            }
            if (newTournament.womenSingle.enabled) {
                setActiveContent(Content.WOMAN_SINGLE);
            }
            if (newTournament.menDouble.enabled) {
                setActiveContent(Content.MAN_DOUBLE);
            }
            if (newTournament.womenDouble.enabled) {
                setActiveContent(Content.WOMAN_DOUBLE);
            }
            if (newTournament.mixedDouble.enabled) {
                setActiveContent(Content.MIXED_DOUBLE);
            }
        }

        updateTournament(newTournament);
    }

    const getCompeteTeam = () => {
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
    }

    const setCompeteTeam = (teams: CompeteTeam[]) => {
        const newTournament = { ...tournament };
        switch (activeContent) {
            case Content.MAN_SINGLE:
                newTournament.menSingle.teams = teams;
                break
            case Content.WOMAN_SINGLE:
                newTournament.womenSingle.teams = teams;
                break
            case Content.MAN_DOUBLE:
                newTournament.menDouble.teams = teams;
                break
            case Content.WOMAN_DOUBLE:
                newTournament.womenDouble.teams = teams;
                break
            case Content.MIXED_DOUBLE:
                newTournament.mixedDouble.teams = teams;
                break
            default:
                return newTournament;
        }
        return newTournament;
    }

    const registerNewMember = (name: string, member: CompeteMember, symbol?: string) => {
        const temp = JSON.parse(JSON.stringify(getCompeteTeam())) as CompeteTeam[];
        const team = temp.find(item => item.name === name);
        team.symbol = symbol;
        team.members.push(member);
        const newTournament = setCompeteTeam(temp);

        return updateTournament(newTournament);
    }
    const registerNewTeam = (name: string, member: CompeteMember, symbol?: string) => {
        const temp = JSON.parse(JSON.stringify(getCompeteTeam())) as CompeteTeam[];
        temp.push({
            name,
            symbol,
            members: [member],
        })
        const newTournament = setCompeteTeam(temp);

        return updateTournament(newTournament)
    }

    const deleteMember = (name: string, teamName: string) => {
        const temp = JSON.parse(JSON.stringify(getCompeteTeam())) as CompeteTeam[];
        const team = temp.find(item => item.name === teamName);
        const index = team.members.findIndex(member => member.name === name);
        team.members.splice(index, 1);

        if (team.members.length === 0) {
            const teamIndex = temp.findIndex(item => item.name === teamName);
            temp.splice(teamIndex, 1);
            const newTournament = setCompeteTeam(temp);
            updateTournament(newTournament);
        } else {
            const newTournament = setCompeteTeam(temp);
            updateTournament(newTournament);
        }
    }

    const updateRank = (name: string, teamName: string, dir: 'up' | 'down') => {
        const temp = JSON.parse(JSON.stringify(getCompeteTeam())) as CompeteTeam[];
        const team = temp.find(item => item.name === teamName);
        const member = team.members.find(item => item.name === name);
        if (member.seedRank === 3 && dir === 'up') {
            return;
        }
        if (member.seedRank === 0 && dir === 'down') {
            return;
        }
        if (dir === 'up') {
            member.seedRank += 0.5;
        } else {
            member.seedRank -= 0.5;
        }
        const newTournament = setCompeteTeam(temp);
        updateTournament(newTournament);
    }

    const updateTournament = (data: TournamentSchema) => {
        return save<TournamentSchema>('TOURNAMENTS', data).then(value => {
            setTournament(value);
        });
    }

    return (
        <Container>
            {
                tournament ? (
                    <>
                        <SideBar
                            activeTab={activeContent}
                            tournament={tournament}
                            changeActiveContent={changeActiveContent}
                            handleActiveContent={handleActiveContent}
                        />
                        <TournamentStatistic
                            handleUpdateRank={updateRank}
                            deleteMember={deleteMember}
                            registerNewTeam={registerNewTeam}
                            registerNewMember={registerNewMember}
                            tournament={tournament}
                            activeContent={activeContent}
                        />
                    </>
                ) : <Spin spinning size='large' />
            }
        </Container>
    )
}

export default TournamentRegistration