import React, { FC, useEffect, useRef, useState } from 'react';
// import { Stage, Layer } from 'react-konva';
import { TreeContainer } from './styled';
import TournamentBracket, { Tree } from './Tree';

type Props = {
    levels: number;
    participants: string[];
}

const TournamentTree: FC<Props> = ({ participants }) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    });

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

        const tree = new Tree(0, 0,
            containerRef.current.clientWidth / 2 - 42,
            containerRef.current.clientHeight,
            'toRight',
            TournamentBracket.canvas
        );

        tree.createLevels(8);

        tree.render();

    }, []);

    return (
        <TreeContainer ref={containerRef} id="tree-container">

        </TreeContainer>
    )
}

export default TournamentTree