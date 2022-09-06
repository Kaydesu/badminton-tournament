import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  pageStyle,
  PreviewSection,
  PrintedContent,
  TournamentLayout,
} from "./styled";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Icon from "@components/Icon";
import { CompeteTeam, Content, TournamentSchema } from "@data/Tournament";
import { Spin, Select } from "antd";
import caretLine from "../../../../assets/icons/caret-line.svg";
import TournamentTree from "./TournamentTree";
import { useReactToPrint } from "react-to-print";
import { SubBranch } from "@utils/SubBranch";
import htmlToCanvas from "html2canvas";
import { useToastAction } from "@components/Toast";

const { fetch, create, remove } = window.Api;
const { previewPrint } = window.Controller;
const { Option } = Select;

type Participant = {
  name: string;
  slot: number;
  seeded: boolean;
  prior: boolean;
  team: string;
  symbol: string;
  created: number;
};

const TournamentMatch = () => {
  const navigate = useNavigate();
  const match = useParams<{ id: string }>();
  const printRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { setToastVisible, setToastContent } = useToastAction();

  const [tournament, setTournament] = useState<TournamentSchema>(null);
  const [start, setStart] = useState<number>(null);
  const [disabled, setDisabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [currentBranch, setCurrentBranch] = useState("");
  const [totalBranch, setTotalBranch] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imgSrc, setImageSrc] = useState("");

  useEffect(() => {
    fetch<TournamentSchema>("TOURNAMENTS", match.id).then((response) => {
      setTournament(response);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (currentBranch) {
      fetch<any>("MATCHES", `${match.id}/${location.state}/${currentBranch}`)
        .then((response) => {
          localStorage.setItem(currentBranch, JSON.stringify(response.result));
          reload();
        })
        .catch((err) => {
          console.log("errrrr: ", err);
        });
    }
  }, [currentBranch]);

  const reload = () => {
    setReady(false);
    setTimeout(() => {
      setReady(true);
    }, 100);
  };

  const printMatch = useReactToPrint({
    content: () => printRef.current,
    pageStyle: pageStyle,
    // print: (target: HTMLIFrameElement) => {
    //     return new Promise(() => {
    //         let data = target.contentWindow.document.documentElement.outerHTML;
    //         let blob = new Blob([data], { type: 'text/html' });
    //         let url = URL.createObjectURL(blob);
    //         previewPrint(url);
    //     })
    // },
  });

  const contentText = () => {
    const content = location.state;
    switch (content) {
      case Content.MAN_SINGLE:
        return "Đơn nam";
      case Content.MAN_DOUBLE:
        return "Đôi nam";
      case Content.WOMAN_DOUBLE:
        return "Đôi nữ";
      case Content.WOMAN_SINGLE:
        return "Đơn nữ";
      case Content.MIXED_DOUBLE:
        return "Đôi nam/nữ";
      default:
        return "";
    }
  };

  const branches = useMemo<
    {
      teams: CompeteTeam[];
      name: string;
    }[]
  >(() => {
    if (!tournament) {
      return [];
    }
    let competeTeams: CompeteTeam[];
    const content = location.state;

    switch (content) {
      case Content.MAN_SINGLE:
        competeTeams = JSON.parse(JSON.stringify(tournament.menSingle.teams));
        break;
      case Content.MAN_DOUBLE:
        competeTeams = JSON.parse(JSON.stringify(tournament.menDouble.teams));
        break;
      case Content.WOMAN_DOUBLE:
        competeTeams = JSON.parse(JSON.stringify(tournament.womenDouble.teams));
        break;
      case Content.WOMAN_SINGLE:
        competeTeams = JSON.parse(JSON.stringify(tournament.womenSingle.teams));
        break;
      case Content.MIXED_DOUBLE:
        competeTeams = JSON.parse(JSON.stringify(tournament.mixedDouble.teams));
        break;
      default:
        return [];
    }
    let total = 0;
    competeTeams.map((team) => {
      total += team.members.length;
    });

    if (total > 32) {
      const branch = new SubBranch("", competeTeams);
      branch.split(true);
      const result = branch.iterate();

      return result.map((subBranch) => ({
        name: subBranch.name,
        teams: subBranch.distributedTeams,
      }));
    }

    return [
      {
        name: "Nhánh 1",
        teams: competeTeams,
      },
    ];
  }, [tournament]);

  const competition = useMemo<{
    teamList: string[];
    members: Participant[];
  }>(() => {
    if (branches.length === 0 || currentBranch === "") {
      return {
        teamList: [],
        members: [],
      };
    }

    const competeTeams = JSON.parse(
      JSON.stringify(
        branches.find((branch) => branch.name === currentBranch).teams
      )
    ) as CompeteTeam[];

    const members: Participant[] = [];
    const teamList: string[] = [];

    competeTeams.map((team) => {
      teamList.push(team.name);
      team.members.map((member) => {
        members.push({
          team: team.name,
          symbol: team.symbol,
          name: member.name,
          prior: Boolean(member.prior),
          seeded: member.seeded,
          created: member.created,
          slot: null,
        });
      });
    });
    members.sort((a, b) => a.created - b.created);

    teamList.push(teamList.splice(teamList.indexOf("Tự do"), 1)[0]);

    return {
      members,
      teamList,
    };
  }, [branches, currentBranch]);

  useEffect(() => {
    if (branches.length > 0) {
      setTotalBranch(branches.map((branch) => branch.name));
      setCurrentBranch(branches[0].name);
    }
  }, [branches]);

  useEffect(() => {
    resetResult();
  }, [currentBranch]);

  const resetResult = () => {
    setReady(false);
    setTimeout(() => {
      setReady(true);
    }, 100);
  };

  const previewResult = () => {
    htmlToCanvas(document.getElementById("tournament-tree-container")).then(
      (canvas) => {
        const base64 = canvas.toDataURL("image/png");
        setImageSrc(base64);
        setPreviewOpen(true);
      }
    );
  };

  const closePreview = () => {
    setImageSrc("");
    setPreviewOpen(false);
  };

  const saveResult = () => {
    const data = JSON.parse(localStorage.getItem(currentBranch));
    create("MATCHES", {
      id: `${tournament.id}/${location.state}/${currentBranch}`, // {TOURNAMENT_ID}-{COMPETITION_CONTENT}-{BRANCH_NAME}
      result: data,
    }).then((res) => {
      setToastVisible(true);
      setToastContent(["Lưu kết quả thành công"], "success");
    });
  };

  return (
    <TournamentLayout>
      <div className="header">
        <button
          className="redirect"
          onClick={() => navigate(`/tournament/${match.id}`)}
        >
          <div>
            <Icon src={caretLine} />
            Ghi danh
          </div>
        </button>
        <Select
          value={currentBranch}
          onChange={(e) => {
            setCurrentBranch(e);
            setReady(false);
            setTimeout(() => {
              setReady(true);
            }, 100);
          }}
        >
          {totalBranch.map((name) => (
            <Option key={name}>{name}</Option>
          ))}
        </Select>
      </div>
      {tournament ? (
        <div className="container">
          <div className="tournament-bracket tambo-scrollbar">
            <PrintedContent
              className="tournament-tree"
              id="tournament-tree-container"
              ref={printRef}
            >
              <div className="tournament-info">
                <h2 className="tournament-name">
                  {tournament.name} ({tournament.age}) - {contentText()}
                </h2>
                <div className="branch-number">{currentBranch}</div>
              </div>
              {ready && (
                <TournamentTree
                  previewResult={previewResult}
                  branchName={currentBranch}
                  resetResult={resetResult}
                  teamList={competition.teamList}
                  participantsList={competition.members}
                  start={0}
                  ready={ready}
                  printMatch={printMatch}
                  saveResult={saveResult}
                />
              )}
            </PrintedContent>
          </div>
          <div className="control-panel" id="control-panel"></div>
        </div>
      ) : (
        <div className="loading">
          <Spin size="large" spinning />
        </div>
      )}
      {previewOpen && (
        <PreviewSection>
          <div className="mask" onClick={closePreview}></div>
          <img src={imgSrc} alt="preview" />
        </PreviewSection>
      )}
    </TournamentLayout>
  );
};

export default TournamentMatch;
