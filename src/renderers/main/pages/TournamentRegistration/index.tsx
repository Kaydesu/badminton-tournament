import React, { FC, useEffect, useState } from 'react'
import { TournamentSchema } from '@data/Tournament';
import { useMatch, useParams } from 'react-router-dom'
import SideBar from './SideBar';
import { Container } from './styled';
import TournamentStatistic from './TournamentStatistic';
import { Spin } from 'antd';

const { fetch } = window.Api;

const TournamentRegistration: FC = () => {

    const match = useParams<{ id: string }>();

    const [tournament, setTournament] = useState<TournamentSchema>(null);

    useEffect(() => {
        fetch<TournamentSchema>('TOURNAMENTS', match.id).then(res => {
            setTournament(res);
        })
    }, []);


    return (
        <Container>
            {
                tournament ? (
                    <>
                        <SideBar tournament={tournament} />
                        <TournamentStatistic />
                    </>
                ) : <Spin spinning size='large'/>
            }
        </Container>
    )
}

export default TournamentRegistration