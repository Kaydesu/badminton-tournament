import React, { useEffect, useMemo, useRef, useState } from 'react'
import { pageStyle, PrintedContent, TournamentLayout } from './styled';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '@components/Icon';
import Button from '@components/Button';
import { CompeteMember, CompeteTeam, Content, TournamentSchema } from '@data/Tournament';
import { Menu, Spin } from 'antd';
import caretLine from '../../../../assets/icons/caret-line.svg';
import { contentList } from '@utils/constants';
import TournamentTree from './TournamentTree';
import { useReactToPrint } from 'react-to-print';
import { splitArray, suffleList } from '@utils/math';


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
    const [pagination, setPagination] = useState(() => ({
        current: 1,
        total: 1
    }));

    useEffect(() => {
        fetch<TournamentSchema>('TOURNAMENTS', match.id).then((response) => {
            setTournament(response);
        });
    }, []);

    useEffect(() => {
        if (tournament) {
            if (tournament.menSingle.enabled) {
                return setContent(() => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                    return Content.MAN_SINGLE
                });
            }
            if (tournament.womenSingle.enabled) {
                return setContent(() => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                    return Content.WOMAN_SINGLE
                });
            }
            if (tournament.menDouble.enabled) {
                return setContent(() => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                    return Content.MAN_DOUBLE
                });
            }
            if (tournament.womenDouble.enabled) {
                return setContent(() => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                    return Content.WOMAN_DOUBLE
                });
            }
            if (tournament.mixedDouble.enabled) {
                return setContent(() => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                    return Content.MIXED_DOUBLE
                });
            }
        }
    }, [tournament])

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
                competeTeams = JSON.parse(JSON.stringify(tournament.menSingle.teams));
                break;
            case Content.MAN_DOUBLE:
                competeTeams = JSON.parse(JSON.stringify(tournament.menDouble.teams));
                break;
            case Content.WOMAN_DOUBLE:
                competeTeams = JSON.parse(JSON.stringify(tournament.womenDouble.teams));
                break;
            case Content.WOMAN_SINGLE:
                competeTeams = JSON.parse(JSON.stringify(tournament.womenSingle.teams));
                break;
            case Content.MIXED_DOUBLE:
                competeTeams = JSON.parse(JSON.stringify(tournament.mixedDouble.teams));
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
        members.sort((a, b) => a.created - b.created);

        setPagination({
            ...pagination,
            total: members.length > 20 ? 2 : 1,
        })

        if (members.length > 20) {
            const splitted = splitArray(suffleList(members));
            return [splitted[pagination.current - 1], true];
        }

        return [members, false];
    }, [content, tournament, pagination.current]);

    const tree = useMemo(() => {
        return (
            <TournamentTree
                leftOnly={participants[1] as boolean}
                start={start}
                participants={participants[0] as any[]}
                enableButtons={() => setDisabled(false)}
            />
        )
    }, [participants, start, pagination.total]);

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


    const backward = () => {
        setPagination({
            ...pagination,
            current: pagination.current - 1,
        });
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }

    const foward = () => {
        setPagination({
            ...pagination,
            current: pagination.current + 1,
        });
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }

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
                        onClick={printMatch}
                        buttonType='secondary'
                    >
                        In sơ đồ
                    </Button>
                </div>
            </div>
            {tournament ?
                (
                    <div className="container">
                        <div className="tournament-bracket tambo-scrollbar">
                            <PrintedContent className="tournament-tree" id="tournament-tree-container" ref={printRef}>
                                <div className="tournament-info">
                                    <h2 className='tournament-name'>{tournament.name} ({tournament.age}) - {contentText}</h2>
                                    <div className="branch-number">Nhánh: 1</div>
                                </div>
                            </PrintedContent>
                        </div>
                        <div className="contron-panel"></div>
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