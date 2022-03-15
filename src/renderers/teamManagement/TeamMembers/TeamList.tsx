import Icon from '@components/Icon'
import React, { FC } from 'react'
import { TeamListItemStyled, TeamListStyled } from './styled'

import trash from '../../../assets/icons/trash.svg';
import male from '../../../assets/icons/gender-male.svg';
import female from '../../../assets/icons/gender-female.svg';
import { AthleteSchema } from '@data/Athlete';

type Props = {
    data: AthleteSchema[];
    onArange: (id: number, direction: 'up' | 'down') => void;
    onShowInfo: (info: AthleteSchema) => void;
    onRemoveMember: (id: string) => void;
}

const TeamList: FC<Props> = ({ data, onArange, onShowInfo, onRemoveMember }) => {

    return (
        <TeamListStyled className='tambo-scrollbar'>
            {data.map((item, index) => (
                <TeamListItemStyled key={item.id} onDoubleClick={() => onShowInfo(item)}>
                    <span className='name'>
                        <Icon src={item.sex === 'MALE' ? male : female} />
                        {item.name}
                    </span>
                    <span className="arange">
                        <Icon onClick={() => onRemoveMember(item.id)} src={trash} className='trash' />
                    </span>
                </TeamListItemStyled>
            ))}
        </TeamListStyled>
    )
}

export default TeamList