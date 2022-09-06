import styled from "styled-components";

export const TournamentLayout = styled.div`
    position: relative;
    height: 100%;

    .header {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        position: relative;
        background: #fdfdfd;
        box-shadow: 0 2px 8px #f0f1f2;
        .redirect {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 10px;
            font-size: 18px;
            .tambo-icon {
                margin: 0 10px;
            }
            div {
                display: flex;
                align-items: center;
            }
        }
    }

    .container {
        height: calc(100% - 50px);
        padding-top: 10px;
        display: flex;
        .tournament-bracket {
            overflow: auto;
        }
        .control-panel {
            flex-grow: 1;
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
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
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
    z-index: 1;
    @media print {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin: auto;
        font-family: 'Nunito' !important;

        .athlete-name {
            font-family: 'Nunito' !important;
        }

        .match-id.valid {
            color: rgba(0, 0, 0, 0.85) !important;
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
            color: #348dfe;
            font-weight: 500;
            font-size: 18px;
        }
    }

    .athlete-name {
        position: absolute;
        transform: translate(0, -100%);
        min-width: 150px;
        height: 30px;
        display: flex;
        align-items: flex-end;
        padding-right: 5px;
        &.drag-enter {
            border: 1px dashed blue;
        }

        &.active {
            color: red;
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

export const Staging = styled.div<{ disabled: boolean; }>`
    .title {
        background: #eef2f8;
        display: flex;
        align-items: center;
        height: 46px;
        padding: 0 10px;
        font-size: 20px;
        border-radius: 4px;
        margin-bottom: 10px;
        cursor: pointer;

        .tambo-icon {
            margin-right: 15px;
        }
    }

    .result-button {
        width: 100%;
        margin-bottom: 5px;
    }
`

export const ControlPanel = styled.div`
    width: 100%;
    height: 100%;
    padding: 40px 30px;
    width: 100%;
    background-color: #fdfdfd;

    .setting-field {
        margin-top: 20px;
        padding-top: 5px;

        .tambo-button {
            display: block;
            width: 100%;
            margin-bottom: 5px;
        }
    }
`

export const SeedTable = styled.div`
    .table-header {
        padding: 3px 0;
        background-color: #bdd2ef;
        text-align: center;
        font-size: 16px;
        margin-bottom: 15px
    }

    .seeded-list {
        li {
            padding: 0 10px;
            height: 24px;
            display: flex;
            align-items:center;
            justify-content: space-between;
            &.selected {
                background: #348dfe;
                color: #fff;
            }
            &.done {
                text-decoration: line-through;
            }
            &.priority {
                cursor: move;
            }
            .tambo-icon {
                font-size: 18px;
                transform: rotate(90deg);
            }
        }
    }

    .actions {
        display: flex;
        justify-content: space-between;
        .tambo-button {
            width: calc(50% - 7px);
        }
    }
`

export const PreviewSection = styled.div`
    position: fixed;
    inset: 0;
    
    z-index: 1;

    .mask {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
    }

    img {
        position: absolute;
        height: 98%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`