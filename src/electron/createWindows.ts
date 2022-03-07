import WindowManager from '@classes/WindowManager';
import { WINDOW_NAME } from '@utils/types';

export const openTournamentCreateWindow = () => {
    WindowManager.createWindow(WINDOW_NAME.CREATE_TOURNAMENT, {
        width: 510,
        height: 395,
        resizable: false,
        movable: false,
    });
}

export const openTeamManagementWindow = () => {
    WindowManager.createWindow(WINDOW_NAME.TEAM_MANAGEMENT, {
        width: 950,
        height: 565,
        resizable: false,
        movable: false,
    })
}