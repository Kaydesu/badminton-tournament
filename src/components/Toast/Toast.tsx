import Icon from '@components/Icon';
import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components'
import { useToastAction, useToastState } from '.'

import closeCircle from '../../assets/icons/close-circle.svg';

const ToastStyle = styled.div<{type: 'error' | 'success' | 'info'}>`
    position: relative;
    cursor: pointer;
    background-color: ${({type}) => type === 'error' ? '#da4528c4' : type === 'success' ? '#28da90c4' : '#2875dac4'};
    border-radius: 4px;
    padding: 8px 12px;
    color: #fff;
    min-width: 200px;
    position: fixed;
    left: 50%;
    top: 15px;
    transform: translateX(100vw);
    transition: all 0.3s ease-in;

    &.visible {
        transform: translateX(-50%);
    }

    .tambo-icon {
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(102%, -5px);
    }

    .toast-message-list {
        margin: 0;
        padding-left: 15px;
        font-size: 16px;
        &__item {
            list-style: initial;
            margin-bottom: 5px;
        }
    }
`


const Toast: FC = () => {
    const [toastTimeOut, setToastTimeOut] = useState(null);
    const { visible, type, messages } = useToastState();
    const { setToastVisible } = useToastAction();

    useEffect(() => {
        clearTimeout(toastTimeOut);
        if (visible) {
            setToastTimeOut(setTimeout(() => {
                setToastVisible(false);
            }, 1500));
        }
    }, [visible]);

    return (
        ReactDOM.createPortal(
            <ToastStyle type={type} className={visible ? 'visible' : ''}>
                <ul className='toast-message-list'>
                    {messages.map((item, index) => (
                        <li key={`toast-${index}`} className='toast-message-list__item'>
                            {item}
                        </li>
                    ))}
                </ul>
            </ToastStyle>,
            document.getElementById('toast-root')
        )
    )
}

export default Toast