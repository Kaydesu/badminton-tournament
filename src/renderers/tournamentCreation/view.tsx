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
    hostId: '',
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
    const [teams, setTeams] = useState<TeamSchema[]>([]);

    const { setToastContent, setToastVisible } = useToastAction();

    useEffect(() => {
        document.title = 'Tạo giải đấu';

        fetch<TeamSchema[]>('TEAMS').then(data => {
            setTeams(data);
        })

    }, []);

    const handleSelectHost = (value: string) => {
        setNewTournament({
            ...newTournament,
            hostId: value,
        })
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTournament({
            ...newTournament,
            [e.target.name]: e.target.value,
        })
    }

    const createTournament = () => {
        const errors = [];
        if (newTournament.name === '' || newTournament.hostId === '') {
            !newTournament.name && errors.push('Tên giải không được để trống');
            !newTournament.hostId && errors.push('Phải chọn ban tổ chức giải đấu');
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
                        max={22}
                        min={16}
                        onChange={onChange}
                        type='number'
                        name='age'
                        value={!newTournament.age ? '' : newTournament.age} />
                </div>
            </div>
            <div className="field">
                <div className="field-label">Ban tổ chức</div>
                <div className="field-input">
                    {teams && teams.length > 0 && (

                        <Select onChange={handleSelectHost} value={newTournament.hostId}>
                            {
                                teams.map(item => (
                                    <Option value={item.id} key={item.id}>
                                        {item.teamName}
                                    </Option>
                                ))
                            }
                        </Select>
                    )}
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