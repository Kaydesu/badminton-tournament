import React, { FC, useEffect, useRef, useState } from 'react';
// import { Stage, Layer } from 'react-konva';
import { TreeContainer } from './styled';
import Tree from './Tree';

type Props = {
    levels: number;
    participants: string[];
}

const TournamentTree: FC<Props> = () => {

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

        // const stage = new Konva.Stage({
        //     width: containerRef.current.clientWidth,
        //     height: containerRef.current.clientHeight,
        //     container: 'tree-container',
        // });

        Tree.initialize(containerRef.current.clientWidth, containerRef.current.clientHeight, 'tree-container');

    }, []);

    return (
        <TreeContainer ref={containerRef} id="tree-container">

        </TreeContainer>
    )
}

export default TournamentTree