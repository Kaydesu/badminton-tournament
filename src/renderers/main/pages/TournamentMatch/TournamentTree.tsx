import { CompeteMember } from '@data/Tournament';
import { nodeHeight, nodeWidth, playOffNodeHeight, playOffNodeWidth } from '@utils/constants';
import { generateRandom, getBaseLog, isOdd, splitArray, suffleList } from '@utils/math';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
// import { Stage, Layer } from 'react-konva';
import { NameContainer, TreeContainer } from './styled';
import TournamentBracket, { Tree } from './Tree';

type Props = {
    participants: CompeteMember[];
    start: number;
}

interface Slot {
    index: number;
    picked: string[];
}

const TournamentTree: FC<Props> = ({ participants, start }) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    });

    const [leftTreeResult, setLeftTreeResult] = useState<Slot[]>([]);
    const [rightTreeResult, setRightTreeResult] = useState<Slot[]>([]);

    const [treeNodes, setTreeNodes] = useState({
        left: 0,
        right: 0,
        leftPlayoffs: 0,
        rightPlayoffs: 0,
    })

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
        if (start) {
            // console.log(participants);
            const suffle = suffleList(participants);
            // console.log(suffle);
            getNodePosition(
                treeNodes.left,
                treeNodes.right,
                suffle,
                treeNodes.leftPlayoffs,
                treeNodes.rightPlayoffs,
            );
        }
    }, [start]);

    useEffect(() => {
        if (participants.length > 0) {
            const matchTemplates = calculateTournamentTemplate(participants.length);
            if (matchTemplates.length === 1) {
                const width = 75 * containerRef.current.clientWidth / 100;
                const spacing = (containerRef.current.clientWidth - width) / 2;
                const tree = new Tree(spacing, 0,
                    width,
                    containerRef.current.clientHeight,
                    'toRight',
                    TournamentBracket.canvas
                );
                TournamentBracket.setTreeLeft(tree);
                tree.createLevels(matchTemplates[0].nodes, 1);
                tree.createPlayOff(matchTemplates[0].playOffs)
                tree.render();

                setTreeNodes({
                    ...treeNodes,
                    left: matchTemplates[0].nodes,
                    leftPlayoffs: matchTemplates[0].playOffs,
                });
            } else if (matchTemplates.length === 2) {
                const leftTree = new Tree(0, 0,
                    containerRef.current.clientWidth / 2 - 20,
                    containerRef.current.clientHeight,
                    'toRight',
                    TournamentBracket.canvas
                );
                const rightTree = new Tree(containerRef.current.clientWidth / 2 + 20, 0,
                    containerRef.current.clientWidth / 2 - 20,
                    containerRef.current.clientHeight,
                    'toLeft',
                    TournamentBracket.canvas
                );

                TournamentBracket.setTreeLeft(leftTree);
                TournamentBracket.setTreeRight(rightTree);

                leftTree.createLevels(matchTemplates[0].nodes, 1);
                leftTree.createPlayOff(matchTemplates[0].playOffs)

                rightTree.createLevels(matchTemplates[1].nodes, matchTemplates[0].nodes + 1);
                rightTree.createPlayOff(matchTemplates[1].playOffs)

                leftTree.render();
                rightTree.render();
                setTreeNodes({
                    left: matchTemplates[0].nodes,
                    right: matchTemplates[1].nodes,
                    leftPlayoffs: matchTemplates[0].playOffs,
                    rightPlayoffs: matchTemplates[1].playOffs,
                });
            }
        }
    }, [participants]);

    const calculateTournamentTemplate = (total: number) => {
        if (total >= 12) {
            const firstHalf = Math.ceil(total / 2);
            const secondHalf = total - firstHalf;
            // create first half branches:
            const firstTemplate = calculatePlayoffs(firstHalf);
            const secondTemplate = calculatePlayoffs(secondHalf);
            // create second half:
            return [
                firstTemplate,
                secondTemplate
            ]
        } else {
            return [
                calculatePlayoffs(total)
            ];
        }
    }

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

    const getNodePosition = (
        leftNodes: number,
        rightNodes: number,
        participants: any[],
        leftPlayoffs: number,
        rightPlayoffs: number
    ) => {
        const firstHalf = Math.ceil(participants.length / 2);
        const ballot = new Array(leftNodes).fill(0).map((_, index) => index + 1);
        const idList = new Array(firstHalf).fill(0).map((_, index) => index + 1)
        const list = new Array(firstHalf).fill(0).map((_, index) => ({
            name: participants[index].name,
            slot: 0,
        }));
        // Calculate for left tree:
        let pick: Slot[] = [];
        let exclude: number[] = [];
        let min = idList[0];
        let max = idList[idList.length - 1];
        let highRank = 0;

        // console.log('LEFT >>> ID list: ', idList01);
        // console.log('LEFT >>> Ballot: ', ballot01);
        // console.log('LEFT >>> Min / max: ', min, max);
        // ================================= RIGHT TREE ================================ //

        if (leftPlayoffs === 0) {
            if (participants.length >= 12) {
                const [ballot01, ballot02] = splitArray(ballot);
                const [idList01, idList02] = splitArray(idList);
                const [list01, list02] = splitArray(suffleList(list));
                let exclude: number[] = [];
                let min = idList01[0];
                let max = idList01[idList01.length - 1];
                ballot01.map((key, index) => {
                    const node = TournamentBracket.leftTree.getNode(key);
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
                    const node = TournamentBracket.leftTree.getNode(key);
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
                const idList = new Array(participants.length).fill(0).map((_, index) => index + 1)
                const list = new Array(participants.length).fill(0).map((_, index) => ({
                    name: participants[index].name,
                    slot: 0,
                }));

                const [ballot01, ballot02] = splitArray(ballot);
                const [idList01, idList02] = splitArray(idList);
                const [list01, list02] = splitArray(suffleList(list));
                let exclude: number[] = [];
                let min = idList01[0];
                let max = idList01[idList01.length - 1];

                ballot01.map((key, index) => {
                    const node = TournamentBracket.leftTree.getNode(key);
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
                    const node = TournamentBracket.leftTree.getNode(key);
                    if (!node.hasParents) {
                        const randomIndex = generateRandom(min, max, exclude);
                        pick.push({
                            index: key,
                            picked: [list02[randomIndex - 1].name],
                        });
                        exclude.push(randomIndex);
                    }
                });
            }
        } else {
            if (participants.length >= 12) {
                let suffle = suffleList(list);
                ballot.map((key, index) => {
                    const node = TournamentBracket.leftTree.getNode(key);
                    if (!node.hasParents) {
                        pick.push({
                            index: key,
                            picked: [suffle[highRank].name],
                        });
                        exclude.push(highRank + 1);
                        highRank += 1;
                    }
                });
                ballot.map((key, index) => {
                    const node = TournamentBracket.leftTree.getNode(key);
                    if (node.hasParents) {
                        let picked = [];
                        let randomIndex = generateRandom(min, max, exclude);
                        picked.push(suffle[randomIndex - 1].name);
                        exclude.push(randomIndex);

                        randomIndex = generateRandom(min, max, exclude);
                        picked.push(suffle[randomIndex - 1].name);
                        exclude.push(randomIndex);

                        pick.push({
                            index: key,
                            picked,
                        })
                    }
                });
            } else {
                const idList = new Array(participants.length).fill(0).map((_, index) => index + 1)
                const list = new Array(participants.length).fill(0).map((_, index) => ({
                    name: participants[index].name,
                    slot: 0,
                }));
                // let min = idList[0];
                // let max = idList[idList.length - 1];

                let officialSlots: any[] = [];
                let highRankSlots: any[] = [];
                let highRankList: any[] = [];

                ballot.map((key, index) => {
                    const node = TournamentBracket.leftTree.getNode(key);
                    if (!node.hasParents) {
                        officialSlots.push(key);
                        highRankSlots.push(highRank + 1);
                        highRankList.push(list[highRank]);
                        highRank += 1;
                        // pick.push({
                        //     index: key,
                        //     picked: [suffle[highRank].name],
                        // });
                        // exclude.push(highRank + 1);
                    }
                });


                let min = highRankSlots[0];
                let max = highRankSlots[highRankSlots.length - 1];

                let suffle = suffleList(highRankList);
                // Just like case 0 playoffs:
                const [ballot01, ballot02] = splitArray(officialSlots);
                const [idList01, idList02] = splitArray(highRankSlots);
                const [list01, list02] = splitArray(suffle);
                // Debug:
                // console.log('Official ballots: ', officialSlots);
                // console.log('High ranks: ', highRankSlots);
                // console.log(min, max);
                // Implements:

                let exclude: number[] = [];
                min = idList01[0];
                max = idList01[idList01.length - 1];
                ballot01.map((key, index) => {
                    const node = TournamentBracket.leftTree.getNode(key);
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
                    const node = TournamentBracket.leftTree.getNode(key);
                    if (!node.hasParents) {
                        const randomIndex = generateRandom(min, max, exclude);
                        pick.push({
                            index: key,
                            picked: [list02[randomIndex - 1].name],
                        });
                        exclude.push(randomIndex);
                    }
                });

                exclude = [...highRankSlots];
                let playOffBallots = ballot.filter(id => !officialSlots.includes(id));
                let playOffIds = idList.filter(id => !highRankSlots.includes(id));

                console.log(exclude);
                console.log(playOffBallots);
                console.log(playOffIds);

                min = playOffIds[0];
                max = playOffIds[playOffIds.length - 1];
                playOffBallots.map((key, index) => {
                    const node = TournamentBracket.leftTree.getNode(key);
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

                // officialSlots.map((key, index) => {
                //     const node = TournamentBracket.leftTree.getNode(key);
                //     if (!node.hasParents) {
                //         let picked = [];
                //         let randomIndex = generateRandom(min, max, exclude);
                //         picked.push(list[randomIndex - 1].name);
                //         exclude.push(randomIndex);
                //         pick.push({
                //             index: key,
                //             picked,
                //         });
                //     }
                // });


            }
        }

        setLeftTreeResult(pick);

        // ================================= RIGHT TREE ================================ //
        if (participants.length >= 12) {
            const secondHalf = firstHalf + 1;
            const rest = participants.length - firstHalf;
            const ballot = new Array(rightNodes).fill(0).map((_, index) => leftNodes + index + 1);
            const idList = new Array(rest).fill(0).map((_, index) => secondHalf + index);

            const list = new Array(rest).fill(0).map((_, index) => ({
                name: participants[secondHalf + index - 1].name,
                slot: 0,
            }));

            const pick: Slot[] = [];
            let exclude: number[] = [];
            let min = idList[0];
            let max = idList[idList.length - 1];
            let highRank = 0;

            if (rightPlayoffs === 0) {
                const [ballot01, ballot02] = splitArray(ballot);
                const [idList01, idList02] = splitArray(idList);
                const [list01, list02] = splitArray(suffleList(list));

                let exclude: number[] = [];
                let min = idList01[0];
                let max = idList01[idList01.length - 1];

                // console.log(ballot01, ballot02);
                // console.log(idList01, idList02);
                // console.log(firstHalf);

                ballot01.map((key, index) => {
                    const node = TournamentBracket.rightTree.getNode(key);
                    if (!node.hasParents) {
                        const randomIndex = generateRandom(min, max, exclude);
                        pick.push({
                            index: key,
                            picked: [list01[randomIndex - firstHalf - 1].name],
                        });
                        exclude.push(randomIndex);
                    }
                });
                exclude = [];
                ballot02.map((key, index) => {
                    const node = TournamentBracket.rightTree.getNode(key);
                    if (!node.hasParents) {
                        const randomIndex = generateRandom(min, max, exclude);
                        pick.push({
                            index: key,
                            picked: [list02[randomIndex - firstHalf - 1].name],
                        });
                        exclude.push(randomIndex);
                    }
                });


            } else {
                ballot.map((key, index) => {
                    const node = TournamentBracket.rightTree.getNode(key);
                    if (!node.hasParents) {
                        pick.push({
                            index: key,
                            picked: [list[highRank].name],
                        });
                        exclude.push(highRank + firstHalf + 1);
                        highRank += 1;
                    }
                });

                ballot.map((key, index) => {
                    const node = TournamentBracket.rightTree.getNode(key);
                    if (node.hasParents) {
                        let picked = [];
                        let randomIndex = generateRandom(min, max, exclude);
                        exclude.push(randomIndex);
                        picked.push(list[randomIndex - secondHalf].name);
                        randomIndex = generateRandom(min, max, exclude);
                        picked.push(list[randomIndex - secondHalf].name);
                        exclude.push(randomIndex);
                        pick.push({
                            index: key,
                            picked,
                        })
                    }
                });
            }
            setRightTreeResult(pick);
        }
    }

    const leftTree = useMemo(() => {
        const label: JSX.Element[] = [];
        leftTreeResult.map((slot, index) => {
            const node = TournamentBracket.leftTree.getNode(slot.index);
            if (slot.picked.length == 2) {
                const pos01 = node.parents[0].position();
                const pos02 = node.parents[1].position();
                label.push(
                    <div
                        style={{
                            left: pos01.x,
                            top: pos01.y,
                            fontSize: 12,
                            width: playOffNodeWidth,
                            height: playOffNodeHeight,
                        }}
                        className="label"
                        key={slot.picked[0]}
                    >
                        {slot.picked[0]}
                    </div>,
                    <div
                        style={{
                            left: pos02.x,
                            top: pos02.y,
                            fontSize: 12,
                            width: playOffNodeWidth,
                            height: playOffNodeHeight,
                        }}
                        className="label"
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
                            left: position.x,
                            top: position.y,
                            width: nodeWidth,
                            height: nodeHeight,
                        }}
                        className={`label ${slot.picked[0] === 'Tambo-A' || slot.picked[0] === 'HLong-A' ? 'red' : ''}`}
                        key={slot.picked[0]}
                    >
                        {slot.picked[0]}
                    </div>
                )
            }
        });

        return label;
    }, [leftTreeResult]);

    const rightTree = useMemo(() => {
        const label: JSX.Element[] = [];
        rightTreeResult.map((slot, index) => {
            const node = TournamentBracket.rightTree.getNode(slot.index);
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
                        className={`label ${slot.picked[0] === 'Tambo-B' || slot.picked[0] === 'LongAn-A' ? 'red' : ''}`}
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
            <NameContainer>
                {leftTree}
                {rightTree}
            </NameContainer>
        </>
    );
}

export default TournamentTree