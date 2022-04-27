import React, { FC } from 'react'
import { Radio, RadioChangeEvent } from 'antd'
import { SideBarItem, SideBarStyled } from './styled'
import { Content, TournamentSchema } from '@data/Tournament'
import { contentList } from '@utils/constants'

type Props = {
    tournament: TournamentSchema;
    activeTab: Content;
    changeActiveContent: (contentType: Content) => void;
    handleActiveContent: (name: Content, checked: boolean) => void;
}

const SideBar: FC<Props> = ({
    tournament,
    activeTab,
    changeActiveContent,
    handleActiveContent
}) => {

    const getEnable = (key: string) => {
        switch (key) {
            case 'menSingle':
                return tournament.menSingle.enabled;
            case 'menDouble':
                return tournament.menDouble.enabled;
            case 'womenSingle':
                return tournament.womenSingle.enabled;
            case 'womenDouble':
                return tournament.womenDouble.enabled;
            case 'mixedDouble':
                return tournament.mixedDouble.enabled;
        }
    }

    return (
        <SideBarStyled>
            {
                contentList.map((item, index) => (
                    <SideBarItem
                        key={`${item.key}-${index}`}
                        className={activeTab === item.content ? 'active' : ''}
                        disabled={!getEnable(item.key)}
                    >
                        <Radio
                            onClick={() => handleActiveContent(item.content, !getEnable(item.key))}
                            checked={getEnable(item.key)}
                            name={item.key}
                        />
                        <span
                            onClick={() => changeActiveContent(item.content)}
                            className='content-label'
                        >
                            {item.label}
                        </span>
                    </SideBarItem>
                ))
            }
        </SideBarStyled>
    )
}

export default SideBar