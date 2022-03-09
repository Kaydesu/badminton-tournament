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

export const TournamentTable = styled.div`
   margin-top: 20px;

   .headers {
        display: flex;
        justify-content: space-between;
        font-size: 20px;
        margin-bottom: 12px;
   }
}
`

export const TournamentItem = styled(Link)`
    height: 50px;
    width: 100%;
    border-radius: 4px;
    background-color: #EBEFF0;
    margin-bottom: 22px;
    padding: 0 22px;

    display: flex;
    align-items: center;
    justify-content: space-between;
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