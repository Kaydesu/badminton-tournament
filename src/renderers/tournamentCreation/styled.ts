import styled from "styled-components";

export const TournamentForm = styled.div`
    padding: 40px;
    .field {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 25px;

        .field-label {
            width: 100px;
        }

        .field-input {
            flex-grow: 1;
        }
    }

    .submit {
        margin-top: 75px;
        text-align: center;
        .tambo-button {
            width: 145px;
        }
    }

    .tambo-input-suggestion > .tambo-scrollbar {
        max-height: 100px;
    }
`