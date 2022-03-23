import { Link } from "react-router-dom"
import styled from "styled-components"

export const TournamentSummaryLayout = styled.div`
    width: 70%;
    margin: auto;
    margin-top: 75px;
    .layout-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .tambo-icon {
            cursor: pointer;
        }
    }
`

export const TournamentTable = styled.table`
    margin-top: 20px;
    margin-bottom: 15px;
    width: 100%;
    thead > tr > th {
        font-size: 16px;
        text-align: left;
        padding: 0 12px;
    }

    tbody > tr {
        background-color: #EBEFF0;
        cursor: pointer;
    }
}
`

export const TournamentItem = styled.button`
    height: 42px;
    padding: 0 12px;
    cursor: pointer;
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