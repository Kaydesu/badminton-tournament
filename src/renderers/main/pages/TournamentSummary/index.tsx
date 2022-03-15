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
                    <div className='grid-container'>
                        <div className="headers">
                            <span>Tên giải</span>
                            <span>Chủ nhà</span>
                            <span>Vận động viên</span>
                        </div>
                        {
                            tournamentInfo.map(item => (
                                <TournamentItem onClick={() => navigate(`/tournament/${item.id}`)} key={item.id}>
                                    <span>{item.name}</span>
                                    <span>{item.host}</span>
                                    <span>{item.participants}</span>
                                </TournamentItem>
                            ))
                        }
                    </div>
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