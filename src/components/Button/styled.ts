import styled from 'styled-components';

export const MainButton = styled.button`
    background-color: #348dfe;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    padding: 10px 14px;
    transition: box-shadow 0.2s;
    box-shadow: 1px 4px 4px rgb(50 101 216 / 25%);

    &:hover:not(:disabled) {
        box-shadow: 1px 2px 4px rgb(50 101 216 / 76%);
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`

export const SecondaryButton = styled(MainButton)`
    border: 1px solid #348dfe;
    background-color: #fdfdfd;
    color: #4B4B4B;
    box-shadow: none;

    &:hover:not(:disabled) {
        box-shadow: 1px 2px 4px rgb(50 101 216 / 25%);
    }
`