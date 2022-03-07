import React, { FC } from 'react';
import { TournamentSummary, WINDOW_NAME } from '@utils/types';
import Button from '@components/Button';
import { EmptyView, TournamentGrid, TournamentItem, TournamentSummaryLayout } from './styled';
import Icon from '@components/Icon';
import addCircle from '../../../../assets/icons/add-circle.svg';


type Props = {
    tournaments: TournamentSummary[];
}

const { openWindow } = window.Controller;

const TournamentSummaryPage: FC<Props> = ({ tournaments }) => {
    return tournaments.length > 0 ?
        (
            <TournamentSummaryLayout>
                <div className="layout-header">
                    <h2>Giải đấu đã tạo</h2>
                    <div onClick={() => openWindow(WINDOW_NAME.CREATE_TOURNAMENT)}><Icon src={addCircle} /></div>
                </div>
                <TournamentGrid className='tambo-scrollbar'>
                    <div className='grid-container'>
                        {
                            tournaments.map(item => (
                                <TournamentItem key={item.id}>
                                    <h2 className='tournament-title'>
                                        {item.name}
                                    </h2>
                                    <div className="tournament-info">
                                        <div className="tournament-info--row">
                                            <span className="label">Ban tổ chức</span>
                                            <span className="value">{item.host}</span>
                                        </div>
                                        <div className="tournament-info--row">
                                            <span className="label">Vận động viên</span>
                                            <span className="value">{item.participants}</span>
                                        </div>
                                        <div className="tournament-info--row">
                                            <span className="label">Lứa tuổi</span>
                                            <span className="value">U-{item.age}</span>
                                        </div>
                                    </div>
                                    <div className="tourmament-status">
                                        <span className="label">Trạng thái</span>
                                        <span className="value">{item.status}</span>
                                    </div>
                                </TournamentItem>
                            ))
                        }
                    </div>
                </TournamentGrid>
            </TournamentSummaryLayout>
        )
        : (
            <EmptyView className='empty-view'>
                <div className="empty-title">CHƯA CÓ GIẢI ĐẤU</div>
                <Button>Tạo giải đấu mới</Button>
            </EmptyView >
        )
}

export default TournamentSummaryPage;