import React, { FC } from 'react'
import { Radio } from 'antd'
import { SideBarItem, SideBarStyled } from './styled'
import { TournamentSchema } from '@data/Tournament'

type Props = {
    tournament: TournamentSchema;
}

const SideBar: FC<Props> = ({ tournament }) => {
    return (
        <SideBarStyled>
            <SideBarItem className='active'>
                <Radio checked={tournament.menSingle.enabled} name="menSingle" />
                <span>Đơn nam</span>
            </SideBarItem>
            <SideBarItem>
                <Radio />
                <span>Đơn nữ</span>
            </SideBarItem>
            <SideBarItem>
                <Radio />
                <span>Đôi nam</span>
            </SideBarItem>
            <SideBarItem>
                <Radio />
                <span>Đôi nữ</span>
            </SideBarItem>
            <SideBarItem>
                <Radio />
                <span>Đôi nam/nữ</span>
            </SideBarItem>
        </SideBarStyled>
    )
}

export default SideBar