import React, { FC, useEffect, useRef, useState, Suspense } from 'react'
import Button from '@components/Button'
import Input, { TextArea } from '@components/Input'
import { TeamSchema } from '@data/Team'
import { InfoForm, InfoSection, SubmitSection, TeamInfoLayout } from './styled'
import Icon from '@components/Icon';

import editIcon from '../../../assets/icons/edit.svg';

type Props = {
    teamInfo: TeamSchema;
    handleConfirm: (data: TeamSchema) => void;
    changeMode: (mode: 'edit' | 'view' | 'add') => void;
    mode: 'edit' | 'view' | 'add'
}

const intialTeamInfo: TeamSchema = {
    id: '',
    teamName: '',
    info: {
        owner: '',
        phone: '',
        address: '',
    },
    members: [],
}

const TeamInfo: FC<Props> = ({ teamInfo, handleConfirm, changeMode, mode }) => {
    const [tempTeam, setTempTeam] = useState<TeamSchema>(intialTeamInfo);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (teamInfo) {
            setTempTeam(teamInfo);
        }
    }, [teamInfo]);

    useEffect(() => {
        if (mode === 'add') {
            setTempTeam(intialTeamInfo);
        }
    }, [mode]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const data: TeamSchema = {
            id: tempTeam.id,
            teamName: formData.get('teamName').toString(),
            info: {
                owner: formData.get('owner').toString(),
                phone: formData.get('phone').toString(),
                address: formData.get('address').toString(),
            },
            members: tempTeam.members,
        }
        handleConfirm(data);
    }

    const handleCancel = () => {
        if (mode === 'add') {
            // clear form
            setTempTeam(intialTeamInfo);
        } else if (mode === 'edit') {
            changeMode('view');
            setTempTeam(teamInfo);
        }
    }

    const onUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const { teamName, info: { address, owner, phone } } = tempTeam;

        setTempTeam({
            ...tempTeam,
            teamName: name === 'teamName' ? value : teamName,
            info: {
                owner: name === 'owner' ? value : owner,
                phone: name === 'phone' ? value : phone,
                address: name === 'address' ? value : address,
            }
        })
    }

    return (
        <TeamInfoLayout>
            {
                mode === 'edit' || mode === 'add' ? <>
                    <div className='team-info-label'>Thông tin đội</div>
                    <InfoForm ref={formRef} >
                        <div className="field field--name">
                            <Input
                                value={tempTeam.teamName}
                                onChange={onUpdate}
                                label='Tên đội:'
                                name='teamName'
                            />
                        </div>
                        <div className="field field--other">
                            <Input
                                value={tempTeam.info.owner}
                                onChange={onUpdate}
                                label='Chủ sân:'
                                name='owner'
                            />
                            <Input
                                value={tempTeam.info.phone}
                                onChange={onUpdate}
                                label='Số điện thoại:'
                                name='phone'
                            />
                        </div>
                        <div className="field field--address">
                            <TextArea
                                value={tempTeam.info.address}
                                onChange={onUpdate}
                                label='Địa chỉ:'
                                name='address'
                            />
                        </div>
                    </InfoForm>
                    <SubmitSection>
                        <Button
                            onClick={handleSave}
                            type='submit'
                        >
                            {mode === 'edit' ? 'Lưu' : 'Tạo đội'}
                        </Button>
                        <Button
                            buttonType='secondary'
                            type='button'
                            onClick={handleCancel}
                        >
                            {mode === 'edit' ? 'Hủy' : 'Xóa trắng'}
                        </Button>
                    </SubmitSection>
                </>
                    :
                    <InfoSection>
                        {
                            tempTeam ? (
                                <>
                                    <h2>{tempTeam.teamName} <Icon onClick={() => changeMode("edit")} src={editIcon} /></h2>
                                    <div className="info-field">
                                        <span className="info-field-label">Chủ sân:</span>
                                        <span className="info-field-data">{tempTeam.info.owner}</span>
                                    </div>
                                    <div className="info-field">
                                        <span className="info-field-label">Số điện thoại:</span>
                                        <span className="info-field-data">{tempTeam.info.phone}</span>
                                    </div>
                                    <div className="info-field__address">
                                        <span className="info-field-label">Địa chỉ:</span>
                                        <span className="info-field-data">{tempTeam.info.address}</span>
                                    </div>

                                </>
                            ) : <div> Loading</div>
                        }
                    </InfoSection>
            }
        </TeamInfoLayout >
    )
}

export default TeamInfo