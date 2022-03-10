import React, { FC, useEffect, useState } from 'react'
import { Content, TournamentSchema } from '@data/Tournament';
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

    const handleActiveContent = (name: string, checked: boolean) => {
        if (name === 'menSingle') {
            return;
        }

        const newTournament = { ...tournament };
        switch (name) {
            case 'menSingle':
                newTournament.menSingle.enabled = checked;
                break;
            case 'womenSingle':
                newTournament.womenSingle.enabled = checked;
                break;
            case 'menDouble':
                newTournament.menDouble.enabled = checked;
                break;
            case 'womenDouble':
                newTournament.womenDouble.enabled = checked;
                break;
            case 'mixedDouble':
                newTournament.mixedDouble.enabled = checked;
                break;
        }
        updateTournament(newTournament);
    }

    const updateTournament = (data: TournamentSchema) => {
        save<TournamentSchema>('TOURNAMENTS', data).then(value => {
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