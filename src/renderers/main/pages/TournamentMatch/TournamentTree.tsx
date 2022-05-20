import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { CompeteMember } from '@data/Tournament';
import { formatNumber, paddingLeft, paddingTop } from '@utils/constants';
import { generateRandom, getBaseLog, isOdd, splitArray, suffleList } from '@utils/math';
import { ImageContainer, NameContainer, Pagination, TreeContainer } from './styled';
import TournamentBracket from './Tree';
import caretLine from '../../../../assets/icons/caret-line.svg';
import Icon from '@components/Icon';

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
    const [matchBase64, setMatchBase64] = useState(null);
    const [ballots, setBallots] = useState<{
        id: number;
        ballot: number;
        isPlayoff: boolean;
        position: { x: number; y: number };
    }[]>([]);
    const [matches, setMatches] = useState<{
        id: number;
        position: { x: number; y: number };
    }[]>([]);

    useEffect(() => {
        TournamentBracket.initialize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight,
            'tree-container'
        );
        
    }, []);


    useEffect(() => {
        if(participants.length > 0) {
            const total = participants.length;
            TournamentBracket.createLevels(total);
            TournamentBracket.render();
            setBallots(TournamentBracket.generateBallots());
            setMatches(TournamentBracket.generateMatchIds(total));
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
            // setMatchBase64(null);
            // matching().then(() => {
            //     enableButtons();
            //     const canvas = TournamentBracket.canvas;
            //     const image = canvas.toDataURL("image/png");
            //     setMatchBase64(image);
            // })
        }
    }, [start]);

    const matching = () => {

    }

    const onImageLoad = () => {
    }

    const getColorByName = (name: string, side: 1 | 2) => {

    }

    const matchLabel = useMemo(() => {
        return <NameContainer>
            {
                ballots.map(item => (
                    <div
                        style={{
                            left: item.position.x + paddingLeft,
                            top: item.position.y + paddingTop,
                        }}
                        // className='match-id'
                        className={`match-id ${!item.isPlayoff ? 'valid' : ''}`}
                        key={item.id}
                    >
                        {item.id}
                    </div>
                ))
            }
            {
                matches.map(item => (
                    <div
                        style={{
                            left: item.position.x + paddingLeft,
                            top: item.position.y + paddingTop,
                        }}
                        className="match-id"
                        key={item.id + "-" + "matches"}
                    >
                        {formatNumber(item.id)}
                    </div>
                ))
            }
        </NameContainer>
    }, [ballots, matches]);

    return (
        <TreeContainer ref={containerRef} id="tree-container">
            {/* {
                matchBase64 && (
                    <ImageContainer>
                        <img src={matchBase64} alt="lull" onLoad={onImageLoad} />
                    </ImageContainer>
                )
            }
            <NameContainer>
           
            </NameContainer> */}
            {matchLabel}
        </TreeContainer>
    );
}

export default TournamentTree