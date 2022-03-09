import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { TournamentSummary, TOURNAMENT_STATUS } from '@utils/types';
import TournamentSummaryPage from './pages/TournamentSummary';
import { AppLayout } from './styled';
import { TournamentSchema } from '@data/Tournament';
import TournamentRegistration from './pages/TournamentRegistration';

const { fetchConsecutive, fetch } = window.Api;

const View = () => {
    const [tournaments, setTournaments] = useState<TournamentSummary[]>([]);

    useEffect(() => {
        getTournaments();
    }, []);

    const getTournaments = () => {
        fetchConsecutive('TOURNAMENTS').then((data: TournamentSchema[]) => {
            setTournaments(data.map(tournament => ({
                id: tournament.id,
                host: tournament.hostId,
                age: tournament.age,
                name: tournament.name,
                participants: getTotalParticipants(tournament),
            })))
        });

        fetch('TOURNAMENTS').then((data: TournamentSchema[]) => {
            setTournaments(data.map(tournament => ({
                id: tournament.id,
                host: tournament.hostId,
                age: tournament.age,
                name: tournament.name,
                participants: getTotalParticipants(tournament),
            })))
        });

    };

    const getTotalParticipants = (tournament: TournamentSchema) => {
        let sum = 0;
        sum += tournament.menSingle.enabled ? tournament.menSingle.teams.length : 0;
        sum += tournament.womenSingle.enabled ? tournament.womenSingle.teams.length : 0;
        sum += tournament.menDouble.enabled ? tournament.menDouble.teams.length : 0;
        sum += tournament.womenDouble.enabled ? tournament.womenDouble.teams.length : 0;
        sum += tournament.mixedDouble.enabled ? tournament.mixedDouble.teams.length : 0;
        return sum;
    }

    return (
        <AppLayout>
            <Router>
                <Routes>
                    <Route path='/' element={<TournamentSummaryPage tournaments={tournaments} />} />
                    <Route path='/tournament/:id' element={<TournamentRegistration />} />
                </Routes>
            </Router>
        </AppLayout >
    )
}

export default View