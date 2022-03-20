import styled from "styled-components";

export const TournamentLayout = styled.div`
    .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 30px 25px;
        .redirect {
            display: flex;
            align-items: center;
        }

        .action {
            display: flex;
            .tambo-button {
                margin-left: 20px;
                padding: 0;
                height: 36px;
                width: 145px;
            }

            .tambo-button.disabled {
                opacity: 0.4;
                pointer-events: none;
            }
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: calc(100vh - 96px);
        .title {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            .tournament-name {
                margin-bottom: 0;
                margin-right: 10px;
            }

            .tambo-icon {
                cursor: pointer;
            }
        }

        .tournament-tree {
            position: relative;
            width: 90%;
            height: calc(100% - 60px);
            margin-top: 12px;
        }
    }
`

export const TreeContainer = styled.div`
    width: 100%;
    height: 100%;
`

export const NameContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .label {
        position: absolute;
        font-weight: 500;
        color: #4b4b4b;
        background-color: #EBEFF0;
        padding: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;

        &.red {
            color: red;
        }

        &.blue {
            color: blue;
        }
    }
`