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

    .container {
        height: calc(100vh - 56px);
        display: flex;
        .tournament-bracket {
            overflow: auto;
        }
        .control-panel {
            flex-grow: auto;
            height: 100%;
            box-shadow: 1px 1px 4px rgb(0 0 0 / 30%);
        }
    }
`

export const PrintedContent = styled.div`
    position: relative;
    width: 210mm;
    height: 296mm;
    margin: 0 5px 40px 25px;
    border: 1px solid #000;
    display: flex;
    flex-direction: column;

    .tournament-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 7mm 10mm 0 10mm;

        >h2 {
            margin: 0;
        }
    }

    @media print {
        position: fixed;
        left: 0;
        top: 0;
        margin: 0;
        border: none;

        .tournament-info {
            font-family: 'Nunito' !important;
        }
    }
`

export const TreeContainer = styled.div`
    flex-grow: 1;
    position: relative;
    canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
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
            font-family: 'Nunito' !important;
            background-color: #c8d3d5 !important;
        }
    }

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .match-id {
        position: absolute;
        transform: translate(-120%, -50%);
        transition: all 0.3s ease-in;
        &.valid {
            color: #1d36e9;
            font-weight: 500;
            font-size: 18px;
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
        size: a4 portrait;
    }
`

export const Pagination = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;

    .branch {
        margin: 0 12px;
    }

    .tambo-icon {
        cursor: pointer;
        &.toRight {
            transform: rotate(180deg);
        }
    }
`