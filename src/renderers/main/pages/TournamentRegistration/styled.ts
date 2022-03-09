import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;

    .ant-spin {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

export const SideBarStyled = styled.div`
    background-color: #EBEFF0;
    width: 250px;
    height: 100%;
    padding-top: 32px;
`

export const SideBarItem = styled.button`
    width: 100%;
    height: 50px;
    font-size: 20px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    margin-bottom: 65px;
    cursor: pointer;

    &.active {
        background-color: #fff;
    }
`

export const StatisticStyled = styled.div`
    flex-grow: 1;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        .redirect {
            display: flex;
            align-items: center;
            font-size: 18px;
            .tambo-icon {
                margin: 0 10px;
            }
            &--foward {
                .tambo-icon {
                    transform: rotate(180deg);
                }
            }
        }
    }
`

export const StatisticLayout = styled.div`
    padding: 40px 25px 5px 40px;
    height: calc(100% - 30px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .top {
        display: flex;
        flex: 1;
        h2.section-title {
            margin-bottom: 25px;
        }

        .registration {
            flex: 1;
            padding-right: 150px;
            .info-field {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 28px;
                &__label {
                    width: 125px;
                }
                &__input {
                    flex-grow: 1;
                    .tambo-input__input {
                        padding: 5px 12px;
                    }
                }

            }
        }

        .tournament-info {
            flex: 1;
            .info-field {
                height: 42px;
                display: flex;
                align-items: center;
                &__label {
                    margin-right: 12px;
                }
            }
        }
    }

    .bottom {
        flex-grow: 1;
    }
`

export const TableTabs = styled.div`
    padding-left: 12px;
    display: flex;
    .tab-item {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: 142px;
        height: 40px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        &.active {
            background-color: #EBEFF0;
        }
    }
`

export const TableStyle = styled.div`
    height: 350px;
    background-color: #EBEFF0; 
    overflow: hidden;
    table {
        width: 100%;
        th {
            text-align: left;
            padding-left: 30px;
            height: 40px;
        }
        &.table-header {
            border-bottom: 1px solid #C8D0D2;
        }
    }

    .table-body-container {
        max-height: calc(100% - 40px);
        overflow: auto;

        tr {
            td {
                div {
                    padding: 5px 30px;
                    height: 100%;
                    &.action {
                        display: flex;
                        justify-content: flex-end;
                        .tambo-icon {
                            cursor: pointer;
                            margin-left: 30px;
                        }
                        .tambo-icon.down {
                            transform: rotate(180deg);
                        }
                    }
                }
            }
        }
    }
`;