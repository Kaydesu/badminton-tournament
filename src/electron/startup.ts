import { IPCMainStream } from "@classes/IPCStream"
import WindowManager from "@classes/WindowManager";
import { TeamSchema } from "@data/Team";
import { TournamentSchema } from "@data/Tournament";
import { fetchAll } from "@utils/helpers";
import { IPCResponse, WINDOW_NAME } from "@utils/types"
import { openTeamManagementWindow, openTournamentCreateWindow } from "./createWindows";

export const startWindowStream = () => {
    const windowStream = new IPCMainStream<WINDOW_NAME, { data: TeamSchema[] }>('openWindow');
    const closeWindowStream = new IPCMainStream<WINDOW_NAME, IPCResponse<TournamentSchema[]>>('closeWindow');

    closeWindowStream.listen((e, payload) => {
        const appWindow = WindowManager.getWindow(payload);
        appWindow.close();
        WindowManager.goHome();
    });


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
    });



    return windowStream;
}
