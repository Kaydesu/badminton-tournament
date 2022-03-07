import Button from '@components/Button';
import Input from '@components/Input';
import React, { useEffect } from 'react'
import { TournamentForm } from './styled';

const team = [
    'Tambo',
    'Hoàng Long',
    'Tyn sport',
    'Chú cuội',
]

const View = () => {

    useEffect(() => {
        document.title = 'Tạo giải đấu';
    })

    return (
        <TournamentForm>
            <div className="field">
                <div className="field-label">Tên giải đấu</div>
                <div className="field-input"><Input /></div>
            </div>
            <div className="field">
                <div className="field-label">Nhóm tuổi</div>
                <div className="field-input"><Input /></div>
            </div>
            <div className="field">
                <div className="field-label">Ban tổ chức</div>
                <div className="field-input"><Input data={team} /></div>
            </div>
            <div className="submit">
                <Button>
                    Bắt đầu
                </Button>
            </div>
        </TournamentForm>
    )
}

export default View