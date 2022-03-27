import React, { FC, useEffect, useState } from 'react';
import { TournamentSummary, WINDOW_NAME } from '@utils/types';
import Button from '@components/Button';
import { EmptyView, TournamentTable, TournamentItem, TournamentSummaryLayout } from './styled';
import Icon from '@components/Icon';
import addCircle from '../../../../assets/icons/add-circle.svg';
import { TeamSchema } from '@data/Team';
import { useNavigate } from 'react-router-dom';

type Props = {
    tournaments: TournamentSummary[];
}

const { openWindow } = window.Controller;
const { fetch } = window.Api;

const TournamentSummaryPage: FC<Props> = ({ tournaments }) => {

    const navigate = useNavigate();

    const [tournamentInfo, setTournamentInfo] = useState<TournamentSummary[]>([]);

    useEffect(() => {
        const hostIds = tournaments.map(item => item.host);

        Promise.all(hostIds.map((id) => fetch<TeamSchema>('TEAMS', id))).then(teams => {
            setTournamentInfo(tournaments.map((item, i) => ({
                ...item,
                host: teams[i].teamName
            })));
        })

    }, [tournaments]);

    return tournamentInfo.length > 0 ?
        (
            <TournamentSummaryLayout>
                <div className="layout-header">
                    <h2>Giải đấu</h2>
                    <div onClick={() => openWindow(WINDOW_NAME.CREATE_TOURNAMENT)}><Icon src={addCircle} /></div>
                </div>
                <TournamentTable className='tambo-scrollbar'>
                    <thead>
                        <tr>
                            <th>Tên giải</th>
                            <th>Chủ nhà</th>
                            <th>Đội tham gia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tournamentInfo.map(item => (
                                <tr key={item.id} onClick={() => navigate(`/tournament/${item.id}`)}>
                                    <td>
                                        <TournamentItem>
                                            <span>{item.name}</span>
                                        </TournamentItem>
                                    </td>
                                    <td>
                                        <TournamentItem>
                                            <span>{item.host}</span>
                                        </TournamentItem>
                                    </td>
                                    <td>
                                        <TournamentItem>
                                            <span>{item.participants}</span>
                                        </TournamentItem>
                                    </td>
                                </tr>

                            ))
                        }
                    </tbody>
                </TournamentTable>
            </TournamentSummaryLayout>
        )
        : (
            <EmptyView className='empty-view'>
                <div className="empty-title">CHƯA CÓ GIẢI ĐẤU</div>
                <Button onClick={() => openWindow(WINDOW_NAME.CREATE_TOURNAMENT)}>Tạo giải đấu mới</Button>
            </EmptyView >
        )
}

export default TournamentSummaryPage;