import { useToastAction } from '@components/Toast';
import { AthleteSchema } from '@data/Athlete';
import { TeamSchema } from '@data/Team';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import SideBar from './SideBar';
import TeamInfo from './TeamInfo';
import TeamMembers from './TeamMembers';


const AppLayout = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;

    .sidebar-layout {
        width: 185px;
        background-color: #EBEFF0;
    }

    .team-layout {
        flex-grow: 1;
        display: flex;
        &>div {
            flex: 1;
            padding: 14px 28px;
        }
    }

`;

const { fetch, save, remove } = window.Api;

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

const View = () => {
    const [teamList, setTeamList] = useState<TeamSchema[]>([]);
    const [currentTeam, setCurrentTeam] = useState<TeamSchema>(intialTeamInfo);
    const [mode, setMode] = useState<'add' | 'edit' | 'view'>('add');

    const { setToastVisible, setToastContent } = useToastAction();

    useEffect(() => {
        getTeamList();
    }, []);

    const getTeamList = () => {
        fetch<TeamSchema[]>('TEAMS').then(data => {
            setTeamList(data);
            if (data.length > 0) {
                if (currentTeam.id === '') {
                    setCurrentTeam(data[0]);
                } else {
                    setCurrentTeam(data.find(item => item.id === currentTeam.id));
                }
                setMode('view')
            }
        })
    }

    const saveTeamData = (data: TeamSchema) => {
        const errors = [];
        if (data.teamName === '' || data.info.owner === '') {
            !data.teamName && errors.push('Tên đội không được để trống')
            !data.info.owner && errors.push('Tên chủ sân không được để trống')
            setToastVisible(true);
            setToastContent(errors, 'error');
            return;
        }

        if (data.teamName !== '' && data.id === '') {
            const index = teamList.findIndex(item => item.teamName.toLowerCase() === data.teamName.toLowerCase());
            if (index > -1) {
                errors.push('Đội đã tồn tại');
                setToastVisible(true);
                setToastContent(errors, 'error');
                return;
            }
            save('TEAMS', data).then(response => {
                getTeamList();
                setCurrentTeam(response);
                setToastVisible(true);
                setToastContent(['Tạo đội thành công'], 'success');
            });
            return;
        }

        save('TEAMS', data).then(response => {
            getTeamList();
            setCurrentTeam(response);
            // setToastVisible(true);
            // setToastContent(['Chỉnh sửa thành công'], 'success');
        })
    }

    const addMember = (data: AthleteSchema) => {
        data.teamId = currentTeam.id;
        save('ATHLETES', data).then(response => {
            const updatedTeam = { ...currentTeam }
            !updatedTeam.members.includes(response.id) && updatedTeam.members.push(response.id);
            saveTeamData(updatedTeam);
        }).catch(err => {
            console.log(err);
        })
    }

    const removeMember = (id: string) => {
        remove('ATHLETES', id).then(() => {
            const updatedTeam = { ...currentTeam };
            updatedTeam.members = updatedTeam.members.filter(memberId => memberId !== id);
            saveTeamData(updatedTeam);
        });
    }

    const arrangeMember = (index: number, direction: 'up' | 'down') => {
        const updatedTeam = { ...currentTeam } as TeamSchema;
        if (direction === 'up') {
            updatedTeam.members.splice(index - 1, 0, updatedTeam.members.splice(index, 1)[0]);
        } else {
            updatedTeam.members.splice(index + 1, 0, updatedTeam.members.splice(index, 1)[0]);
        };

        saveTeamData(updatedTeam);
    }

    const changeMode = (mode: 'add' | 'edit' | 'view') => {
        setMode(mode);
        if (mode === 'add') {
            setCurrentTeam(intialTeamInfo);
        }
    }

    const handleSelectTeam = (team: TeamSchema) => {
        setCurrentTeam(team);
        setMode('view');
    }

    return (
        <AppLayout>
            <div className="sidebar-layout">
                <SideBar
                    selectedTeam={currentTeam}
                    teamList={teamList}
                    handleAddTeam={() => changeMode('add')}
                    onSelectTeam={handleSelectTeam}
                />
            </div>
            <div className="team-layout">
                <TeamInfo
                    teamInfo={currentTeam}
                    handleConfirm={saveTeamData}
                    changeMode={changeMode}
                    mode={mode}
                />
                {
                    currentTeam.id && <TeamMembers
                        addMember={addMember}
                        removeMember={removeMember}
                        arrangeMember={arrangeMember}
                        members={currentTeam.members}
                    />
                }

            </div>
        </AppLayout>
    )
}

export default View