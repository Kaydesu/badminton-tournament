import styled from "styled-components";

export const SideBarLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 24px;
    height: 100%;
    .tambo-button {
        width: 125px;
        margin-bottom: 47px;
    }
`

export const TeamList = styled.div`
    width: 100%;
    .team-list-label {
        position: relative;
        margin-bottom: 18px;
        text-align: center;
    
        &--text {
            width: fit-content;
            display: block;
            top: -9px;
            left: 50%;
            position: absolute;
            background: #EBEFF0;
            padding: 0 5px;
            z-index: 1;
            transform: translate(-50%, 0);
        }
        &--divider {
            z-index: 0;
            position: absolute;
            width: calc(100% - 10px);
            left: 5px;
            top: 50%;
            height: 1px;
            background-color: rgba(0.75, 0.75, 0.75, 0.29);
        }
    }

    .team-list {
        margin-top: 25px;
        .team-list-item {
            display: flex;
            height: 32px;
            align-items: center;
            padding: 0 22px;
            border-top: 1px solid rgba(0.75, 0.75, 0.75, 0.29);

            &.active {
                background-color: #4B4B4B;
                color: #fff;
            }

            &:last-of-type {
                border-bottom: 1px solid rgba(0.75, 0.75, 0.75, 0.29);
            }

        }
    }
`

