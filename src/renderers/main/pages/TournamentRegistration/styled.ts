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
`;

export const SideBarStyled = styled.div`
  background-color: #e6e8ec;
  width: 250px;
  height: calc(100% - 50px);
  margin-top: 50px;
  padding-top: 32px;
`;

export const SideBarItem = styled.button`
  width: 100%;
  height: 50px;
  font-size: 20px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  padding-right: 0;
  margin-bottom: 65px;
  cursor: pointer;

  &.active {
    background-color: #fff;
    color: #348dfe;
  }

  .content-label {
    display: flex;
    flex-grow: 1;
    align-items: center;
    height: 100%;
  }

  &:disabled {
    .content-label {
      opacity: 0.4;
      pointer-events: none;
    }
  }
`;

export const StatisticStyled = styled.div`
  flex-grow: 1;
  .header {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    background: #fdfdfd;
    box-shadow: 0 2px 8px #f0f1f2;
    .redirect {
      display: flex;
      align-items: center;
      font-size: 18px;
      transition: color 0.3s;
      &:hover {
        color: #348dfe;
      }
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
`;

export const StatisticLayout = styled.div`
  padding: 40px 25px 5px 40px;
  height: calc(100% - 50px);
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;

  .top {
    display: flex;
    flex: 1;
    h2.section-title {
      margin-bottom: 25px;
    }

    .registration {
      padding-right: 150px;
      max-width: 600px;
      .info-field {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 28px;

        &--submit {
          justify-content: flex-end;
          .tambo-button {
            width: 125px;
            margin-left: 20px;
          }
        }

        &__label {
          width: 125px;
        }
        &__input {
          flex-grow: 1;
          display: flex;
          align-items: center;
          position: relative;

          .tambo-input {
            width: 100%;
          }

          .separator {
            margin: 0 5px;
          }

          .tambo-input__input {
            width: 100%;
            padding: 5px 12px;
          }
          &--team {
            .tambo-input:first-of-type {
              flex-grow: 1;
            }
            .tambo-input:last-of-type {
              width: 100px;
              margin-left: 10px;
            }
          }
        }

        &__input--double {
          justify-content: flex-end;
          .tambo-input {
            width: calc(50% - 26px);
          }
        }
      }
    }

    .tournament-info {
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
`;

export const TableTabs = styled.div`
  height: 350px;
  overflow: hidden auto;
  margin-right: 50px;
  padding-right: 2px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  .tab-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 142px;
    height: 40px;
    &.active {
      background: #348dfe;
      color: #fff;
    }
  }
`;

export const TableStyle = styled.div`
  margin-bottom: 30px;
  height: 350px;
  background-color: #fdfdfd;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  table {
    width: 100%;
    th {
      text-align: left;
      padding-left: 30px;
      height: 40px;
    }
    &.table-header {
      border-bottom: 1px solid #c8d0d2;
    }
  }

  .table-body-container {
    max-height: calc(100% - 40px);
    overflow: auto;

    tr {
      td {
        padding: 8px 0 8px 30px;
        div {
          width: calc(100% - 10px);
          height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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

          &.seed-rank {
            display: flex;
            cursor: pointer;
            .tambo-icon {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
`;

export const TournamentListSummary = styled.div`
  display: flex;
`;
