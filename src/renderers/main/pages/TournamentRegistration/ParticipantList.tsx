import React, { FC, useEffect, useMemo } from 'react';
import { TableStyle, TableTabs, TournamentListSummary } from './styled';
import trashIcon from '../../../../assets/icons/trash.svg';
import starIcon from '../../../../assets/icons/star.svg';
import starGrey from '../../../../assets/icons/starGrey.svg';
import ribbon from '../../../../assets/icons/ribbon.svg';
import ribbonGray from '../../../../assets/icons/ribbon-gray.svg';

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
        title: 'Năm sinh',
        dataIndex: 'yearOfBirth',
    },
    {
        title: 'Hạt giống',
        dataIndex: 'seeded',
    }
]

type Props = {
    competeTeams: CompeteTeam[];
    handleDelete: (name: string, team: string) => void;
    handleUpdateRank: (memberName: string, teamName: string, prior: boolean) => void;
    currentTab: string;
    setCurrentTab: (e: string) => void;
    hostName: string;
}

const ParticipantList: FC<Props> = ({ competeTeams, handleDelete, handleUpdateRank, currentTab, setCurrentTab, hostName }) => {
    useEffect(() => {
        if (currentTab !== 'all') {
            const index = competeTeams.findIndex(team => team.name === currentTab);
            if (index === -1) {
                setCurrentTab('all')
            }
        }
    }, [competeTeams]);

    const rowData = useMemo(() => {
        const participants: {
            name: string;
            team: string;
            phone: string;
            yearOfBirth: string;
            created: number;
            seeded: boolean;
            prior: boolean;
        }[] = [];

        competeTeams.map((team) => {
            team.members.map((member, i) => {
                if (currentTab === 'all') {
                    participants.push({
                        name: member.name,
                        team: team.name,
                        phone: member.phone,
                        yearOfBirth: member.yearOfBirth,
                        created: member.created,
                        seeded: member.seeded,
                        prior: Boolean(member.prior),
                    });
                } else {
                    if (team.name === currentTab) {
                        participants.push({
                            name: member.name,
                            team: team.name,
                            phone: member.phone,
                            yearOfBirth: member.yearOfBirth,
                            created: member.created,
                            seeded: member.seeded,
                            prior: Boolean(member.prior),
                        });
                    }
                }
            })
        });

        participants.sort((a, b) => a.created - b.created);

        console.log(participants);

        return participants.map((member: any, index) => (
            <tr key={member.name + index}>
                {
                    columns.map((col, i) => (
                        <td key={`${member[col.dataIndex]}-${i}-${index}`}>
                            {
                                col.dataIndex !== 'seeded' ? (
                                    <div>{member[col.dataIndex]}</div>
                                ) : (
                                    <div className='seed-rank'>
                                        <Icon
                                            onClick={() => handleUpdateRank(member.name, member.team, false)}
                                            src={member['seeded'] ? starIcon : starGrey} />
                                    </div>
                                )
                            }
                        </td>
                    ))
                }
                <td>
                    <div className='action'>
                        <Icon
                            onClick={() => handleDelete(member.name, member.team)}
                            src={trashIcon}
                        />
                    </div>
                </td>
            </tr>
        ))
    }, [competeTeams, currentTab, hostName]);

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
        <TournamentListSummary>
            <TableTabs className='tambo-scrollbar'>{tabs}</TableTabs>
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
        </TournamentListSummary>
    )
}

export default ParticipantList