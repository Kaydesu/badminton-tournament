import { CompeteMember } from '@data/Tournament';
import { nodeHeight, nodeWidth, playOffNodeHeight, playOffNodeWidth } from '@utils/constants';
import { generateRandom, getBaseLog, isOdd, splitArray, suffleList } from '@utils/math';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
// import { Stage, Layer } from 'react-konva';
import { ImageContainer, NameContainer, TreeContainer } from './styled';
import TournamentBracket, { Tree } from './Tree';

type Props = {
    participants: CompeteMember[];
    start: number;
    enableButtons: () => void;
}

interface Slot {
    index: number;
    picked: string[];
}

const TournamentTree: FC<Props> = ({ participants, start, enableButtons }) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const [matchBase64, setMatchBase64] = useState(null);
    const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    });

    const [topTiers, setTopTiers] = useState<{
        first: string[];
        second: string[];
    }>({
        first: [],
        second: [],
    })

    const [leftTreeResult, setLeftTreeResult] = useState<Slot[]>([]);
    const [rightTreeResult, setRightTreeResult] = useState<Slot[]>([]);
    const [participantList, setParticipantList] = useState<{
        left: CompeteMember[];
        right: CompeteMember[];
    }>({
        left: [],
        right: []
    });

    const leftTree = useRef<Tree>(null);
    const rightTree = useRef<Tree>(null);

    useEffect(() => {
        setStageSize({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
        });
        TournamentBracket.initialize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight,
            'tree-container'
        );
    }, []);

    useEffect(() => {
        if (participants.length >= 12) {
            const splitted = splitArray(suffleList(participants));
            setParticipantList({
                left: splitted[0],
                right: splitted[1],
            });

            setTopTiers({
                first: [splitted[0][0].name, splitted[1][0].name],
                second: [splitted[0][1].name, splitted[1][1].name]
            });
        } else if (participants.length > 0 && participants.length < 12) {
            const suffled = suffleList(participants);
            setParticipantList({
                left: suffled,
                right: [],
            });

            setTopTiers({
                first: [participants[0].name, participants[1].name],
                second: []
            });
        }
    }, [participants]);

    useEffect(() => {
        if (start) {
            // if (participantList.left.length > 0) {
            //     const suffle = suffleList(participantList.left);
            //     setLeftTreeResult(getNodePosition(leftTree.current, suffle));
            // }
            // if (participantList.right.length > 0) {
            //     const suffle = suffleList(participantList.right);
            //     setRightTreeResult(getNodePosition(rightTree.current, suffle));
            // }
            setMatchBase64(null);
            matching().then(() => {
                enableButtons();
                const canvas = TournamentBracket.canvas;
                const image = canvas.toDataURL("image/png");
                setMatchBase64(image);
            })
        }
    }, [start]);


    useEffect(() => {
        if (participantList.left.length > 0 && participantList.right.length === 0) {
            const matchTemplates = calculatePlayoffs(participantList.left.length);
            const width = 75 * containerRef.current.clientWidth / 100;
            const spacing = (containerRef.current.clientWidth - width) / 2;
            leftTree.current = new Tree(spacing, 0,
                width,
                containerRef.current.clientHeight,
                'toRight',
                TournamentBracket.canvas
            );
            leftTree.current.createLevels(matchTemplates.nodes);
            leftTree.current.createPlayOff(matchTemplates.playOffs)
            leftTree.current.render();
        } else if (participantList.left.length > 0 && participantList.right.length > 0) {
            // Setup left tree
            const leftTemplate = calculatePlayoffs(participantList.left.length)
            leftTree.current = new Tree(0, 0,
                containerRef.current.clientWidth / 2 - 20,
                containerRef.current.clientHeight,
                'toRight',
                TournamentBracket.canvas
            );

            leftTree.current.createLevels(leftTemplate.nodes);
            leftTree.current.createPlayOff(leftTemplate.playOffs);
            leftTree.current.render();

            // Setup right tree
            const rightTemplate = calculatePlayoffs(participantList.right.length);
            rightTree.current = new Tree(containerRef.current.clientWidth / 2 + 20, 0,
                containerRef.current.clientWidth / 2 - 20,
                containerRef.current.clientHeight,
                'toLeft',
                TournamentBracket.canvas
            );

            rightTree.current.createLevels(rightTemplate.nodes);
            rightTree.current.createPlayOff(rightTemplate.playOffs)
            rightTree.current.render();
        }
    }, [participantList]);

    const calculatePlayoffs = (total: number) => {
        let baseLog = Math.round(getBaseLog(2, total));
        let playOffs = Math.abs(total - Math.pow(2, baseLog));
        if (isOdd(playOffs)) {
            let nodes = total - playOffs;
            return {
                playOffs,
                nodes,
            };
        } else {
            let baseLog = Math.floor(getBaseLog(2, total));
            let playOffs = Math.abs(total - Math.pow(2, baseLog));
            let nodes = total - playOffs;
            return {
                playOffs,
                nodes,
            };
        }
    }

    const getNodePosition = (tree: Tree, participants: CompeteMember[]) => {
        const ballot = tree.generateBallots();
        const idList = participants.map((_, index) => index + 1)
        const list = participants.map((item) => ({
            name: item.name,
            slot: 0,
        }));

        let pick: Slot[] = [];

        if (tree.getTotalPlayoffs() === 0) {
            const [ballot01, ballot02] = splitArray(ballot);
            const [idList01, idList02] = splitArray(idList);
            const [list01, list02] = splitArray(list);
            let exclude: number[] = [];
            let min = idList01[0];
            let max = idList01[idList01.length - 1];

            ballot01.map((key, index) => {
                const node = tree.getNode(key);
                if (!node.hasParents) {
                    const randomIndex = generateRandom(min, max, exclude);
                    pick.push({
                        index: key,
                        picked: [list01[randomIndex - 1].name],
                    });
                    exclude.push(randomIndex);
                }
            });
            exclude = [];
            ballot02.map((key, index) => {
                const node = tree.getNode(key);
                if (!node.hasParents) {
                    const randomIndex = generateRandom(min, max, exclude);
                    pick.push({
                        index: key,
                        picked: [list02[randomIndex - 1].name],
                    });
                    exclude.push(randomIndex);
                }
            });
        } else {
            let officialSlots: any[] = [];
            let highRankSlots: any[] = [];
            let highRankList: any[] = [];
            let highRank = 0;
            ballot.map((key, index) => {
                const node = tree.getNode(key);
                if (!node.hasParents) {
                    officialSlots.push(key);
                    highRankSlots.push(highRank + 1);
                    highRankList.push(list[highRank]);
                    highRank += 1;
                }
            });

            // Just like case 0 playoffs:
            const [ballot01, ballot02] = splitArray(officialSlots);
            const [idList01, idList02] = splitArray(highRankSlots);
            const [list01, list02] = splitArray(highRankList);
            let exclude: number[] = [];
            let min = idList01[0];
            let max = idList01[idList01.length - 1];

            ballot01.map((key, index) => {
                const node = tree.getNode(key);
                if (!node.hasParents) {
                    const randomIndex = generateRandom(min, max, exclude);
                    pick.push({
                        index: key,
                        picked: [list01[randomIndex - 1].name],
                    });
                    exclude.push(randomIndex);
                }
            });
            exclude = [];
            min = 0;
            max = list02.length - 1;

            ballot02.map((key, index) => {
                const node = tree.getNode(key);
                if (!node.hasParents) {
                    const randomIndex = generateRandom(min, max, exclude);
                    pick.push({
                        index: key,
                        picked: [list02[randomIndex].name],
                    });
                    exclude.push(randomIndex);
                }
            });

            exclude = [...highRankSlots];
            let playOffBallots = ballot.filter(id => !officialSlots.includes(id));
            let playOffIds = idList.filter(id => !highRankSlots.includes(id));

            min = playOffIds[0];
            max = playOffIds[playOffIds.length - 1];
            playOffBallots.map((key, index) => {
                const node = tree.getNode(key);
                if (node.hasParents) {
                    let picked = [];
                    let randomIndex = generateRandom(min, max, exclude);
                    picked.push(list[randomIndex - 1].name);
                    exclude.push(randomIndex);

                    randomIndex = generateRandom(min, max, exclude);
                    picked.push(list[randomIndex - 1].name);
                    exclude.push(randomIndex);

                    pick.push({
                        index: key,
                        picked,
                    })
                }
            });
        }
        return pick;
    }

    const matching = () => {
        return new Promise((resolve, reject) => {
            let timer: any;

            timer = setInterval(() => {
                if (participantList.left.length > 0) {
                    const suffle = suffleList(participantList.left);
                    setLeftTreeResult(getNodePosition(leftTree.current, suffle));
                }
                if (participantList.right.length > 0) {
                    const suffle = suffleList(participantList.right);
                    setRightTreeResult(getNodePosition(rightTree.current, suffle));
                }
            }, 100);

            setTimeout(() => {
                clearInterval(timer);
                resolve(null);
            }, 3000);
        })
    }

    const onImageLoad = () => {
        console.log("Loadddddd");
    }

    const getColorByName = (name: string, side: 1 | 2) => {
        console.log(topTiers);
        return topTiers.first.includes(name) ? 'red' : topTiers.second.includes(name) ? 'blue' : 'none';
    }

    const leftTreeRender = useMemo(() => {
        if (leftTreeResult.length === 0) {
            return null;
        }

        const label: JSX.Element[] = [];
        const total = participants.length;
        let spacing = 0;
        if (total < 12) {
            const width = 75 * containerRef.current.clientWidth / 100;
            spacing = (containerRef.current.clientWidth - width) / 2;
        }

        leftTreeResult.map((slot, index) => {
            const node = leftTree.current.getNode(slot.index);
            if (slot.picked.length == 2) {
                const pos01 = node.parents[0].position();

                const pos02 = node.parents[1].position();
                label.push(
                    <div
                        style={{
                            left: pos01.x + spacing,
                            top: pos01.y,
                            fontSize: 12,
                            width: playOffNodeWidth,
                            height: playOffNodeHeight,
                        }}
                        // className="label"
                        className={`label ${getColorByName(slot.picked[0], 1)}`}
                        key={slot.picked[0]}
                    >
                        {slot.picked[0]}
                    </div>,
                    <div
                        style={{
                            left: pos02.x + spacing,
                            top: pos02.y,
                            fontSize: 12,
                            width: playOffNodeWidth,
                            height: playOffNodeHeight,
                        }}
                        className="label"
                        // className={`label ${getColorByName(slot.picked[1], 1)}`}
                        key={slot.picked[1]}
                    >
                        {slot.picked[1]}
                    </div>,
                )
            } else {
                const position = node.position();
                label.push(
                    <div
                        style={{
                            left: position.x + spacing,
                            top: position.y,
                            width: nodeWidth,
                            height: nodeHeight,
                        }}
                        className="label"
                        // className={`label ${getColorByName(slot.picked[0], 1)}`}
                        key={slot.picked[0]}
                    >
                        {slot.picked[0]}
                    </div>
                )
            }
        });

        return label;
    }, [leftTreeResult]);

    const rightTreeRender = useMemo(() => {
        const label: JSX.Element[] = [];
        rightTreeResult.map((slot, index) => {
            const node = rightTree.current.getNode(slot.index);
            if (slot.picked.length == 2) {
                const pos01 = node.parents[0].position();
                const pos02 = node.parents[1].position();
                label.push(
                    <div
                        style={{
                            left: stageSize.width - pos01.x - playOffNodeWidth,
                            top: pos01.y,
                            fontSize: 12,
                            width: playOffNodeWidth,
                            height: playOffNodeHeight,
                        }}
                        className="label"
                        // className={`label ${getColorByName(slot.picked[0], 2)}`}
                        key={slot.picked[0]}
                    >
                        {slot.picked[0]}
                    </div>,
                    <div
                        style={{
                            left: stageSize.width - pos02.x - playOffNodeWidth,
                            top: pos02.y,
                            fontSize: 12,
                            width: playOffNodeWidth,
                            height: playOffNodeHeight,
                        }}
                        className="label"
                        // className={`label ${getColorByName(slot.picked[1], 2)}`}
                        key={slot.picked[1]}
                    >
                        {slot.picked[1]}
                    </div>,
                )
            } else {
                const position = node.position();
                label.push(
                    <div
                        style={{
                            left: stageSize.width - position.x - nodeWidth,
                            top: position.y,
                            width: nodeWidth,
                            height: nodeHeight,
                        }}
                        className="label"
                        // className={`label ${getColorByName(slot.picked[0], 2)}`}
                        key={slot.picked[0]}
                    >
                        {slot.picked[0]}
                    </div>
                )
            }
        });

        return label;
    }, [rightTreeResult, stageSize]);

    const canvasContainer = useMemo(() => {
        return (
            <TreeContainer ref={containerRef} id="tree-container">

            </TreeContainer>
        )
    }, []);

    return (
        <>
            {canvasContainer}
            {
                matchBase64 && (
                    <ImageContainer>
                        <img src={matchBase64} alt="lull" onLoad={onImageLoad} />
                    </ImageContainer>
                )
            }
            <NameContainer>
                {leftTreeRender}
                {rightTreeRender}
            </NameContainer>
        </>
    );
}

export default TournamentTree