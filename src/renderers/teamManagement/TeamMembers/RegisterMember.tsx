import Button from '@components/Button'
import Input from '@components/Input'
import React, { FC, useState } from 'react'
import { DivideButton, RegisterForm } from './styled'

type Props = {
    info: {
        name: string;
        sex: 'MALE' | 'FEMALE',
    }
    onUpdateInfo: (info: { name: string; sex: 'MALE' | 'FEMALE' }) => void;
    onCancel: () => void;
    onSave: () => void;
}

const RegisterMember: FC<Props> = ({ info, onUpdateInfo, onCancel, onSave }) => {
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newInfo = { ...info };
        newInfo.name = e.target.value;
        onUpdateInfo(newInfo);
    }

    const handleChangeSex = () => {
        const newInfo = { ...info };
        const sex = info.sex === 'MALE' ? 'FEMALE' : 'MALE';
        newInfo.sex = sex;
        onUpdateInfo(newInfo);
    }

    return (
        <RegisterForm>
            <div className="register-section">
                <Input label={'Họ & tên'} value={info.name} onChange={handleTextChange} />
                <DivideButton className={info.sex === 'MALE' ? 'male' : 'female'} onClick={handleChangeSex}>
                    {info.sex === 'MALE' ? 'Nam' : 'Nữ'}
                </DivideButton>
            </div>
            <div className="confirm-section">
                <Button onClick={onSave}>Lưu</Button>
                <Button onClick={onCancel} buttonType='secondary'>Hủy</Button>
            </div>
        </RegisterForm>
    )
}

export default RegisterMember