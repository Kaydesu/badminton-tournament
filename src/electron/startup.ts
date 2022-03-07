import { IPCMainStream } from "@classes/IPCStream"
import { TeamSchema } from "@data/Team";
import { WINDOW_NAME } from "@utils/types"
import { openTeamManagementWindow, openTournamentCreateWindow } from "./createWindows";

export const startWindowStream = () => {
    const windowStream = new IPCMainStream<WINDOW_NAME, { data: TeamSchema[] }>('openWindow');

    windowStream.listen((e, payload) => {
        switch (payload) {
            case WINDOW_NAME.CREATE_TOURNAMENT:
                openTournamentCreateWindow();
                break;
            case WINDOW_NAME.TEAM_MANAGEMENT:
                openTeamManagementWindow();
                break;
        }
    }).then(data => {
        // Fetch data and send to the views
    })

    return windowStream;
}
