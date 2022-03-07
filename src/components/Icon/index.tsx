import React, { FC } from 'react'
import { IconContainer } from './styled'

type Props = {
    src: string;
    className?: string;
    onClick?: () => void;
}

const Icon: FC<Props> = ({ src, className, onClick }) => {
    return (
        <IconContainer onClick={onClick} className={`tambo-icon${className ? ` ${className}` : ''}`}>
            <img src={src} alt="tambo-icon" />
        </IconContainer>
    )
}

export default Icon