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
