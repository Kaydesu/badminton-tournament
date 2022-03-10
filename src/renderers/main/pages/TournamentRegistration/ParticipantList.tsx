import React, { FC, useMemo, useState } from 'react';
import { TableStyle, TableTabs } from './styled';
import trashIcon from '../../../../assets/icons/trash.svg';
import arrowUp from '../../../../assets/icons/arrow-up.svg';
import Icon from '@components/Icon';
import { CompeteTeam } from '@data/Tournament';


const columns = [
    {
        title: 'Tên',
        dataIndex: 'name',
    },
    {
        title: 'Đội',
        dataIndex: 'team',
    },
    {
        title: 'Sđt',
        dataIndex: 'phone',
    },
    {
        title: 'Mail',
        dataIndex: 'mail',
    },
    {
        title: 'Hạng trong đội',
        dataIndex: 'rankInTeam',
    },
]

type Props = {
    competeTeams: CompeteTeam[];
}

const ParticipantList: FC<Props> = ({ competeTeams }) => {

    const [currentTab, setCurrentTab] = useState('all');

    const rowData = useMemo(() => {
        const participants: {
            name: string;
            team: string;
            phone: string;
            mail: string;
            rankInTeam: number;
        }[] = [];

        competeTeams.map((team) => {
            team.members.map((member, i) => {
                if (currentTab === 'all') {
                    participants.push({
                        name: member.name,
                        team: team.name,
                        phone: member.phone,
                        mail: member.email,
                        rankInTeam: i + 1,
                    });
                } else {
                    if (team.name === currentTab) {
                        participants.push({
                            name: member.name,
                            team: team.name,
                            phone: member.phone,
                            mail: member.email,
                            rankInTeam: i + 1,
                        });
                    }
                }
            })
        });

        return participants.map((member: any, index) => (
            <tr key={member.name + index}>
                {
                    columns.map((col, i) => (
                        <td key={`${member[col.dataIndex]}-${i}-${index}`}>
                            <div>{member[col.dataIndex]}</div>
                        </td>
                    ))
                }
                <td><div className='action'><Icon src={trashIcon} /></div></td>
            </tr>
        ))
    }, [competeTeams, currentTab]);

    const tabs = useMemo(() => {
        return (
            <>
                <div
                    onClick={() => setCurrentTab('all')}
                    className={`tab-item ${currentTab === 'all' ? 'active' : ''}`}
                >
                    Tất cả
                </div>
                {
                    competeTeams.map((team, index) => (
                        <div
                            key={`${team}+${index}___tabs`}
                            onClick={() => setCurrentTab(team.name)}
                            className={`tab-item ${currentTab === team.name ? 'active' : ''}`}
                        >
                            {team.name}
                        </div>
                    ))
                }
            </>
        )
    }, [competeTeams, currentTab]);

    return (
        <>
            <TableTabs>{tabs}</TableTabs>
            <TableStyle>
                <table className='table-header'>
                    <colgroup>
                        <col span={5} width={180} />
                        <col width={'auto'} />
                    </colgroup>
                    <thead>
                        <tr>
                            {
                                columns.map((item, index) => (
                                    <th key={item.title + index}>
                                        {item.title}
                                    </th>
                                ))
                            }
                            <th></th>
                        </tr>
                    </thead>
                </table>
                <div className='table-body-container tambo-scrollbar'>
                    <table>
                        <colgroup>
                            <col span={5} width={180} />
                        </colgroup>
                        <tbody>{rowData}</tbody>
                    </table>
                </div>
            </TableStyle>
        </>
    )
}

export default ParticipantList