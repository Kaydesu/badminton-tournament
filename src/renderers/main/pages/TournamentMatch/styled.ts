import styled from "styled-components";

export const TournamentLayout = styled.div`
    .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 10px 25px;
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
`

export const ContentStyle = styled.div`
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
        width: 296mm;
        height: 210mm;
        margin-top: 12px;
    }

    @media print {
        .title {
            /* display: none; */
            .tambo-icon {
                display: none;
            }
        }
    }
`

export const TreeContainer = styled.div`
    width: 100%;
    height: 100%;
    @media print {
        position: fixed;
        top: 2.5cm;
        left: 5%;
        width: 100%;
        height: 100%;
        margin: auto;
        transform-origin: top left;
        transform: scale(0.9);
    }
`

export const NameContainer = styled.div`
    @media print {
        position: fixed;
        top: 2.5cm;
        left: 5%;
        width: 100%;
        height: 100%;
        margin: auto;
        transform-origin: top left;
        transform: scale(0.9);

        .label {
            background-color: #c8d3d5 !important;
        }
    }

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .label {
        position: absolute;
        font-weight: 500;
        color: #403f6e;
        background-color: #c8d3d5;
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

export const ImageContainer = styled.div`
    @media print {
        position: fixed;
        top: 2.5cm;
        left: 5%;
        width: 100%;
        height: 100%;
        margin: auto;
        transform-origin: top left;
        transform: scale(0.9);
    }

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`

export const pageStyle = `
    @page {
        size: a4 landscape;
    }
`