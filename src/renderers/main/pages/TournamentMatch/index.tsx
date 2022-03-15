import React, { useEffect, useMemo, useState } from 'react'
import { TournamentLayout } from './styled';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '@components/Icon';
import Button from '@components/Button';
import { Content, TournamentSchema } from '@data/Tournament';
import { Dropdown, Menu, Spin } from 'antd';
import caretLine from '../../../../assets/icons/caret-line.svg';
import caretDown from '../../../../assets/icons/caret-down.svg';
import { contentList } from '@utils/constants';
import TournamentTree from './TournamentTree';


const { fetch } = window.Api;

const TournamentMatch = () => {

    const navigate = useNavigate();
    const match = useParams<{ id: string }>();

    const [tournament, setTournament] = useState<TournamentSchema>(null);
    const [content, setContent] = useState<Content>(Content.MAN_SINGLE);

    useEffect(() => {
        fetch<TournamentSchema>('TOURNAMENTS', match.id).then((response) => {
            setTournament(response);
        });
    }, []);

    const contentText = useMemo(() => {
        switch (content) {
            case Content.MAN_SINGLE:
                return 'Đơn nam';
            case Content.MAN_DOUBLE:
                return 'Đôi nam';
            case Content.WOMAN_DOUBLE:
                return 'Đôi nữ';
            case Content.WOMAN_SINGLE:
                return 'Đơn nữ';
            case Content.MIXED_DOUBLE:
                return 'Đôi nam/nữ';
            default:
                return '';
        }
    }, [content]);

    const contentOption = useMemo(() => {
        const temp = { ...tournament } as any;
        return tournament && (
            <Menu
                onClick={(e) => setContent(() => {
                    const content = contentList.find(item => item.key === e.key)['content'];
                    return content;
                })}
            >
                {
                    contentList.map((item, index) => (
                        <Menu.Item
                            key={item.key}
                            disabled={!temp[item.key].enabled}
                        >
                            {item.label}
                        </Menu.Item>
                    ))
                }
            </Menu >
        )
    }, [content, tournament]);

    return (
        <TournamentLayout>
            <div className="header">
                <button onClick={() => navigate('/')} >
                    <div className='redirect'>
                        <Icon src={caretLine} />
                        Ghi danh
                    </div>
                </button>
                <div className="action">
                    <Button>Bắt đầu</Button>
                    <Button buttonType='secondary'>In sơ đồ</Button>
                </div>
            </div>
            {
                tournament ? (
                    <div className="content">
                        <div className="title">
                            <Dropdown overlay={contentOption} >
                                <h2 className='tournament-name'>{tournament.name} - {contentText}</h2>
                            </Dropdown>
                            <Icon src={caretDown} />
                        </div>
                        <div className="tournament-tree" id="tournament-tree-container">
                            <TournamentTree
                                levels={3}
                                participants={['aaaa', 'bbb', 'cccc', 'ddd', 'eeee', 'ffff', 'ggggg', 'hhhh']}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="loading">
                        <Spin size='large' spinning />
                    </div>
                )
            }
        </TournamentLayout>
    )
}

export default TournamentMatch;