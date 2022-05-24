import styled from 'styled-components';

export const MainButton = styled.button`
    background-color: #4B4B4B;
    border-radius: 4px;
    color: #fff;
    transition: border-radius 0.25s;
    font-size: 14px;
    padding: 10px 14px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    &:hover:not(:disabled) {
        border-radius: 18px;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`

export const SecondaryButton = styled(MainButton)`
    border: 1px solid #4B4B4B;
    background-color: #F8F8F8;
    color: #4B4B4B;
    box-shadow: none;
`