import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { TournamentSummary, TOURNAMENT_STATUS } from '@utils/types';
import TournamentSummaryPage from './pages/TournamentSummary';
import { AppLayout } from './styled';

const dumb: TournamentSummary[] = [
    {
        id: '1',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '2',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '3',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '4',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '5',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '6',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '7',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '8',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '9',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '10',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '11',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '12',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
    {
        id: '13',
        name: 'U19 Open',
        age: 19,
        participants: 18,
        host: 'Tambo',
        status: TOURNAMENT_STATUS.INITIAL
    },
]

const View = () => {
    const [tournaments, setTournaments] = useState<TournamentSummary[]>(dumb);

    return (
        <AppLayout>
            <Router>
                <Routes>
                    <Route path='/' element={<TournamentSummaryPage tournaments={tournaments} />} />
                </Routes>
            </Router>
        </AppLayout >
    )
}

export default View