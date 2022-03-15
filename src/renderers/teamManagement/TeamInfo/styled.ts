import styled from "styled-components";

export const TeamInfoLayout = styled.div`
    padding-top: 24px;
    border-right: 1px solid rgba(0.75, 0.75, 0.75, 0.29);
    .team-info-label {
        font-size: 24px;
        text-align: center;
    }
`

export const InfoForm = styled.form`
    .field {
        margin-bottom: 20px;
        &--other {
            display: flex;
            justify-content: space-between;
            .tambo-input {
                width: calc(50% - 10px);
            }
        }
        &--address {
            .tambo-input__input {
                height: 160px;
            }
        }
    }
`

export const InfoSection = styled.div`
    h2 {
        margin: 0;
        text-align: center;
        margin-bottom: 50px;
        position: relative;

        .tambo-icon {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }

    .info-field {
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
    }

    .info-field__address {
        display: flex;
        flex-direction: column;
        .info-field-label {
            margin-bottom: 15px;
        }
    }

`

export const SubmitSection = styled.div`
    display: flex;
    justify-content: space-between;
    .tambo-button {
        width: 145px;
    }
`