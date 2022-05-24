import React, { useEffect, useRef, useState } from 'react'
import Button from '@components/Button';
import Input from '@components/Input';
import { TeamSchema } from '@data/Team';
import { TournamentForm } from './styled';

import { Select } from 'antd';
import { TournamentSchema } from '@data/Tournament';
import { WINDOW_NAME } from '@utils/types';
import { useToastAction } from '@components/Toast';

const { fetch, save } = window.Api;
const { closeWindow } = window.Controller;

const { Option } = Select;

const intialTournament: TournamentSchema = {
    id: '',
    hostName: '',
    age: null,
    name: '',
    status: 'prepare',
    menSingle: {
        enabled: true,
        teams: []
    },
    womenSingle: {
        enabled: false,
        teams: []
    },
    menDouble: {
        enabled: false,
        teams: []
    },
    womenDouble: {
        enabled: false,
        teams: []
    },
    mixedDouble: {
        enabled: false,
        teams: []
    },
}

const View = () => {

    const [newTournament, setNewTournament] = useState(intialTournament);

    const { setToastContent, setToastVisible } = useToastAction();

    useEffect(() => {
        document.title = 'Tạo giải đấu';
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTournament({
            ...newTournament,
            [e.target.name]: e.target.value,
            menSingle: {
                enabled: true,
                teams: [
                    {
                        name: 'Tambo',
                        symbol: '',
                        members: []
                    },
                    {
                        name: 'Tự do',
                        symbol: '',
                        members: []
                    }
                ]
            },
            menDouble: {
                enabled: false,
                teams: [
                    {
                        name: 'Tambo',
                        symbol: '',
                        members: []
                    },
                    {
                        name: 'Tự do',
                        symbol: '',
                        members: []
                    }
                ]
            },
            womenSingle: {
                enabled: false,
                teams: [
                    {
                        name: 'Tambo',
                        symbol: '',
                        members: []
                    },
                    {
                        name: 'Tự do',
                        symbol: '',
                        members: []
                    }
                ]
            },
            womenDouble: {
                enabled: false,
                teams: [
                    {
                        name: 'Tambo',
                        symbol: '',
                        members: []
                    },
                    {
                        name: 'Tự do',
                        symbol: '',
                        members: []
                    }
                ]
            },
            mixedDouble: {
                enabled: false,
                teams: [
                    {
                        name: 'Tambo',
                        symbol: '',
                        members: []
                    },
                    {
                        name: 'Tự do',
                        symbol: '',
                        members: []
                    }
                ]
            },
        })
    };

    const createTournament = () => {
        const errors = [];
        if (newTournament.name === '' || newTournament.hostName === '') {
            !newTournament.name && errors.push('Tên giải không được để trống');
            !newTournament.hostName && errors.push('Ban tổ chức không được để trống');
            setToastVisible(true);
            setToastContent(errors, 'error');
            return;
        }
        const temp = JSON.parse(JSON.stringify(newTournament)) as TournamentSchema;
        if (!temp.age) {
            temp.age = 18;
        }
        save<TournamentSchema>('TOURNAMENTS', temp).then(() => {
            closeWindow(WINDOW_NAME.CREATE_TOURNAMENT);
        })
    }

    return (
        <TournamentForm>
            <div className="field">
                <div className="field-label">Tên giải đấu</div>
                <div className="field-input">
                    <Input
                        onChange={onChange}
                        name='name'
                        value={newTournament.name} />
                </div>
            </div>
            <div className="field">
                <div className="field-label">Nhóm tuổi</div>
                <div className="field-input">
                    <Input
                        onChange={onChange}
                        name='age'
                        value={!newTournament.age ? '' : newTournament.age} />
                </div>
            </div>
            <div className="field">
                <div className="field-label">Ban tổ chức</div>
                <div className="field-input">
                    <Input
                        onChange={onChange}
                        name='hostName'
                        value={!newTournament.hostName ? '' : newTournament.hostName}
                    />
                </div>
            </div>
            <div className="submit">
                <Button onClick={createTournament}>
                    Bắt đầu
                </Button>
            </div>
        </TournamentForm>
    )
}

export default View