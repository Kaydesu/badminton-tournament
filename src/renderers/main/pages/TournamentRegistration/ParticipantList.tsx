import React, { FC, useEffect, useMemo, useState } from 'react';
import { TableStyle, TableTabs } from './styled';
import trashIcon from '../../../../assets/icons/trash.svg';
import starIcon from '../../../../assets/icons/star.svg';
import starGrey from '../../../../assets/icons/starGrey.svg';
import starHalf from '../../../../assets/icons/starHalf.svg';
import arrow from '../../../../assets/icons/arrow-up.svg';
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
        title: 'Xếp loại',
        dataIndex: 'seedRank',
    }
]

type Props = {
    competeTeams: CompeteTeam[];
    handleDelete: (name: string, team: string) => void;
    handleUpdateRank: (memberName: string, teamName: string, dir: 'up' | 'down') => void;
}

const ParticipantList: FC<Props> = ({ competeTeams, handleDelete, handleUpdateRank }) => {

    const [currentTab, setCurrentTab] = useState('all');

    useEffect(() => {
        if (currentTab !== 'all') {
            const index = competeTeams.findIndex(team => team.name === currentTab);
            if (index === -1) {
                setCurrentTab('all')
            }
        }
    }, [competeTeams]);

    const rowData = useMemo(() => {

        const renderSeedRank = (rank: number, key: string) => {
            const arr = new Array(3).fill(0);

            const getIcon = (index: number) => {
                const sub = rank - index;
                if (sub >= 0) {
                    return starIcon;
                } else if (sub >= -0.5 && sub < 0) {
                    return starHalf;
                } else {
                    return starGrey;
                }
            }


            return arr.map((_, index) => (
                <Icon src={getIcon(index + 1)} key={`${key}-star-${index}`} />
            ));
        }

        const participants: {
            name: string;
            team: string;
            phone: string;
            mail: string;
            created: number;
            seedRank: number;
        }[] = [];

        competeTeams.map((team) => {
            team.members.map((member, i) => {
                if (currentTab === 'all') {
                    participants.push({
                        name: member.name,
                        team: team.name,
                        phone: member.phone,
                        mail: member.email,
                        created: member.created,
                        seedRank: member.seedRank,
                    });
                } else {
                    if (team.name === currentTab) {
                        participants.push({
                            name: member.name,
                            team: team.name,
                            phone: member.phone,
                            mail: member.email,
                            created: member.created,
                            seedRank: member.seedRank,
                        });
                    }
                }
            })
        });

        participants.sort((a, b) =>
            (b.seedRank - a.seedRank) === 0 ? a.created - b.created : b.seedRank - a.seedRank
        );

        return participants.map((member: any, index) => (
            <tr key={member.name + index}>
                {
                    columns.map((col, i) => (
                        <td key={`${member[col.dataIndex]}-${i}-${index}`}>
                            {
                                col.dataIndex !== 'seedRank' ? (
                                    <div>{member[col.dataIndex]}</div>
                                ) : (
                                    <div className='seed-rank'>
                                        {renderSeedRank(member[col.dataIndex], `${member[col.dataIndex]}-${i}-${index}`)}
                                    </div>
                                )
                            }
                        </td>
                    ))
                }
                <td>
                    <div className='action'>
                        <Icon
                            onClick={() => handleUpdateRank(member.name, member.team, 'up')}
                            src={arrow}
                        />
                        <Icon
                            onClick={() => handleUpdateRank(member.name, member.team, 'down')}
                            src={arrow}
                            className='down'
                        />
                        <Icon
                            onClick={() => handleDelete(member.name, member.team)}
                            src={trashIcon}
                        />
                    </div>
                </td>
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
                            <col width={'auto'} />
                        </colgroup>
                        <tbody>{rowData}</tbody>
                    </table>
                </div>
            </TableStyle>
        </>
    )
}

export default ParticipantList