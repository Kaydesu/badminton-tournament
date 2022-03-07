import styled from "styled-components";

export const InputStyle = styled.div`
    position: relative;
    .tambo-input__label {
        text-align: left;
        font-size: 14px;
        color: #4B4B4B;
        margin-bottom: 8px;
    }
    .tambo-input__input {
        color: #4B4B4B;
        background: #EBEFF0;
        border-radius: 4px;
        padding: 10px 12px;
        width: calc(100% - 24px);
        ::placeholder {
            color: #7e8497;
            opacity: 0.7;
        }
    }
    .dropdown-icon {
        cursor: pointer;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        font-size: 20px;
        justify-content: center;
    }
`;

export const InputSuggestions = styled.ul<{visible: boolean}>`
    display: ${(props) => props.visible ? 'block' : 'none'};
    position: absolute;
    position: absolute;
    width: 100%;
    background: #fff;
    box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
    padding: 10px 0;
    
    .tambo-scrollbar {
        max-height: 275px;
        overflow: auto;
        padding-right: 3px;
    }

    li {
        padding: 10px 18px;
        cursor: pointer;
        &:hover {
            background-color: #4B4B4B;
            color: #fff;
        }
    }
`