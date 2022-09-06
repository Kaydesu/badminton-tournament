import styled from "styled-components";

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
    border-spacing: 0 12px;
    border-collapse: separate;
    thead > tr > th {
        font-size: 16px;
        text-align: left;
        padding: 0 12px;
        font-weight: 500;
    }

    tbody > tr {
        color: #fff;
        cursor: pointer;
        background-color: #348dfe;
        &:hover {
            opacity: 0.85;
        }
    }
}
`

export const TournamentItem = styled.button`
    height: 36px;
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
        padding: 12px 16px;
        font-size: 18px;
    }
`