import React, { FC } from 'react'
import { StatisticLayout, StatisticStyled } from './styled'
import { Link } from 'react-router-dom'
import caretLine from '../../../../assets/icons/caret-line.svg';
import Icon from '@components/Icon';
import ParticipantList from './ParticipantList';
import Input from '@components/Input';

const TournamentStatistic: FC = () => {
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
                            <div className="info-field__input"><Input /></div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">Tên</div>
                            <div className="info-field__input"><Input /></div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">E-mail</div>
                            <div className="info-field__input"><Input /></div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">Số điện thoại</div>
                            <div className="info-field__input"><Input /></div>
                        </div>
                    </div>
                    <div className="tournament-info">
                        <h2 className="section-title">Thống kê</h2>
                        <div className="info-field">
                            <div className="info-field__label">Vận động viên:</div>
                            <div className="info-field__input">12</div>
                        </div>
                        <div className="info-field">
                            <div className="info-field__label">Đội:</div>
                            <div className="info-field__input">4</div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <ParticipantList />
                </div>
            </StatisticLayout>
        </StatisticStyled>
    )
}

export default TournamentStatistic