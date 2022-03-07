import styled from "styled-components"

export const TournamentSummaryLayout = styled.div`
    margin-top: 75px;
    .layout-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 110px;
    }
`

export const TournamentGrid = styled.div`
    background-color: #EBEFF0;
    border-radius: 20px;
    padding: 22px;
    grid-gap: 12px;
    max-height: 450px;
    overflow: hidden auto;
    width: fit-content;
    margin: auto;

    .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 12px;
    }

}
`

export const TournamentItem = styled.div`
    width: 242px;
    height: 242px;
    background-color: #fff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 24px;

    .tournament-title {
        text-align: center;
    }

    .tournament-info {
        margin-bottom: 72px;
        .tournament-info--row {
            display: flex;
            justify-content: space-between;
            &:not(:last-of-type) {
                margin-bottom: 10px;
            }
        }
    }

    .tourmament-status {
        display: flex;
        justify-content: space-between;
    }

`

export const EmptyView = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    transform: translateY(-75px);

    .empty-title {
        margin-bottom: 50px;
        font-size: 72px;
        color: #DDDDD7;
    }

    .tambo-button {
        width: 265px;
        height: 90px;
        font-size: 24px;
        &:hover {
            border-radius: 43px
        }
    }
`