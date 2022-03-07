import styled from "styled-components";

export const TeamMemberLayout = styled.div`
    display: flex;
    flex-direction: column;
    .team-list-label {
        text-align: center;
        font-size: 24px;
        margin-bottom: 20px
    }

    .tambo-button.add-member {
        width: 168px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:hover {
            border-radius: 24px;
        }
    }
`

export const TeamListStyled = styled.ul`
    flex-grow: 1;
    overflow-y: auto;
    padding-right: 13px;
    margin-top: 24px;
`

export const TeamListItemStyled = styled.li`
    height: 42px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    background-color: #EBEFF0;
    border-radius: 4px;
    margin-bottom: 14px;
    justify-content: space-between;
    cursor: pointer;

    .arange {
        display: flex;
        align-items: center;

        .tambo-icon {
            cursor: pointer;
            margin-left: 3px;
        }
        .tambo-icon.down {
            transform: rotate(180deg);
        }
        .tambo-icon.trash {
            font-size: 18px;
        }
    }

    &:first-of-type {
        .tambo-icon.up {
            display: none;
        }
    }

    &:last-of-type {
        .tambo-icon.down {
            display: none;
        }
    }
`

export const RegisterForm = styled.div`

    .register-section {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 27px;
        .tambo-input {
            flex-grow: 1;
            margin-right: 10px;
        }
    }

    .confirm-section {
        display: flex;
        justify-content: space-between;
        .tambo-button {
            width: 155px;
            text-align: center;
        }
    }
`

export const DivideButton = styled.div`
    width: 90px;
    height: 36px;
    background-color: #1db6ff;
    color: #fff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &.female {
        background-color: #ec2c7c;
    }
`