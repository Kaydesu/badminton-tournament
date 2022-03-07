import Button from '@components/Button'
import { TeamSchema } from '@data/Team'
import React, { FC } from 'react'
import { SideBarLayout, TeamList } from './styled'


type Props = {
    teamList: TeamSchema[];
    selectedTeam: TeamSchema;
    handleAddTeam: () => void;
    onSelectTeam: (data: TeamSchema) => void;
}

const SideBar: FC<Props> = ({ teamList, handleAddTeam, selectedTeam, onSelectTeam }) => {

    return (
        <SideBarLayout>
            <Button onClick={handleAddTeam}>Thêm đội</Button>
            <TeamList>
                <div className="team-list-label">
                    <span className='team-list-label--text'>
                        Danh sách đội
                    </span>
                    <span className='team-list-label--divider' />
                </div>
                <ul className='team-list'>
                    {teamList.map((item, index) => (
                        <li
                            onClick={() => onSelectTeam(item)}
                            className={item.id === selectedTeam.id ? 'team-list-item active' : 'team-list-item'}
                            key={item.id}
                        >
                            {item.teamName}
                        </li>
                    ))}
                </ul>
            </TeamList>
        </SideBarLayout>
    )
}

export default SideBar