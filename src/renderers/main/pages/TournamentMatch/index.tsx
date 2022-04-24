import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ContentStyle, pageStyle, TournamentLayout } from './styled';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '@components/Icon';
import Button from '@components/Button';
import { CompeteMember, CompeteTeam, Content, TournamentSchema } from '@data/Tournament';
import { Dropdown, Menu, Spin } from 'antd';
import caretLine from '../../../../assets/icons/caret-line.svg';
import caretDown from '../../../../assets/icons/caret-down.svg';
import { contentList } from '@utils/constants';
import TournamentTree from './TournamentTree';
import { useReactToPrint } from 'react-to-print';


const { fetch } = window.Api;
const { previewPrint } = window.Controller;

const TournamentMatch = () => {

    const navigate = useNavigate();
    const match = useParams<{ id: string }>();
    const printRef = useRef<HTMLDivElement>(null);

    const [tournament, setTournament] = useState<TournamentSchema>(null);
    const [content, setContent] = useState<Content>(Content.MAN_SINGLE);
    const [start, setStart] = useState<number>(null);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch<TournamentSchema>('TOURNAMENTS', match.id).then((response) => {
            setTournament(response);
        });
    }, []);

    const startRandom = () => {
        setDisabled(true);
        setStart(new Date().getTime());
    }

    const printMatch = useReactToPrint({
        content: () => printRef.current,
        pageStyle: pageStyle,
        // print: (target: HTMLIFrameElement) => {
        //     return new Promise(() => {
        //         let data = target.contentWindow.document.documentElement.outerHTML;
        //         let blob = new Blob([data], { type: 'text/html' });
        //         let url = URL.createObjectURL(blob);
        //         previewPrint(url);
        //     })
        // },
    });

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

    const participants = useMemo(() => {
        if (!tournament) {
            return [];
        }
        let competeTeams: CompeteTeam[];
        switch (content) {
            case Content.MAN_SINGLE:
                competeTeams = tournament.menSingle.teams;
                break;
            case Content.MAN_DOUBLE:
                competeTeams = tournament.menDouble.teams;
                break;
            case Content.WOMAN_DOUBLE:
                competeTeams = tournament.womenDouble.teams;
                break;
            case Content.WOMAN_SINGLE:
                competeTeams = tournament.womenSingle.teams;
                break;
            case Content.MIXED_DOUBLE:
                competeTeams = tournament.mixedDouble.teams;
                break;
            default:
                return [];
        }
        const members: CompeteMember[] = [];
        competeTeams.map((team) => {
            team.members.map(member => {
                member.name = `${member.name}[${team.symbol || team.name}]`
                members.push(member);
            })
        });
        members.sort((a, b) =>
            (b.seedRank - a.seedRank) === 0 ? a.created - b.created : b.seedRank - a.seedRank
        );
        return members;
    }, [content, tournament]);

    const tree = useMemo(() => {
        return (
            <TournamentTree
                start={start}
                participants={participants}
                enableButtons={() => setDisabled(false)}
            />
        )
    }, [participants, start]);

    const contentOption = useMemo(() => {
        const temp = { ...tournament } as any;
        return tournament && (
            <Menu
                onClick={(e) => setContent(() => {
                    const content = contentList.find(item => item.key === e.key)['content'];
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
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
                <button onClick={() => navigate(`/tournament/${match.id}`)} >
                    <div className='redirect'>
                        <Icon src={caretLine} />
                        Ghi danh
                    </div>
                </button>
                <div className="action">
                    <Button
                        className={disabled ? 'disabled' : ''}
                        onClick={startRandom}
                    >
                        Bắt đầu
                    </Button>
                    <Button
                        className={disabled ? 'disabled' : ''}
                        onClick={printMatch}
                        buttonType='secondary'
                    >
                        In sơ đồ
                    </Button>
                </div>
            </div>
            {
                tournament ? (
                    <ContentStyle className="content sheet padding-10mm" ref={printRef}>
                        <div className="title">
                            <Dropdown overlay={contentOption} >
                                <h2 className='tournament-name'>{tournament.name} - {contentText}</h2>
                            </Dropdown>
                            <Icon src={caretDown} />
                        </div>
                        <div className="tournament-tree" id="tournament-tree-container">
                            {!loading && tree}
                        </div>
                    </ContentStyle>
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