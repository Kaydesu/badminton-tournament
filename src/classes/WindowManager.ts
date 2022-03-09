import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { WINDOW_NAME } from "@utils/types";


declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

declare const TOURNAMENT_CREATION_WEBPACK_ENTRY: string;
declare const TOURNAMENT_CREATION_PRELOAD_WEBPACK_ENTRY: string;

declare const TEAM_MANAGEMENT_WEBPACK_ENTRY: string;
declare const TEAM_MANAGEMENT_PRELOAD_WEBPACK_ENTRY: string;

const ENTRIES = {
    [WINDOW_NAME.CREATE_TOURNAMENT]: {
        webpack: TOURNAMENT_CREATION_WEBPACK_ENTRY,
        preload: TOURNAMENT_CREATION_PRELOAD_WEBPACK_ENTRY,
    },
    [WINDOW_NAME.TEAM_MANAGEMENT]: {
        webpack: TEAM_MANAGEMENT_WEBPACK_ENTRY,
        preload: TEAM_MANAGEMENT_PRELOAD_WEBPACK_ENTRY,
    },
}

class WindowManager {
    private _mainWindow: BrowserWindow;
    private _appWindows: Map<string, BrowserWindow>;


    constructor() {
        this._mainWindow = null;
        this._appWindows = new Map();
    }

    createMainWindow() {
        this._mainWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
            }
        });
        this._mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        this._mainWindow.maximize();
        this._mainWindow.webContents.openDevTools();
    }

    createWindow(name: WINDOW_NAME, config: BrowserWindowConstructorOptions) {
        this._appWindows.set(
            name,
            new BrowserWindow({
                ...config,
                maximizable: false,
                parent: this._mainWindow,
                modal: true,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    nodeIntegrationInWorker: false,
                    nodeIntegrationInSubFrames: false,
                    preload: ENTRIES[name].preload,
                }
            })
        );
        this._appWindows.get(name).loadURL(ENTRIES[name].webpack);
        this._appWindows.get(name).webContents.openDevTools();
    }

    getWindow(name: WINDOW_NAME) {
        return this._appWindows.get(name);
    }

    getMainWindow() {
        return this._mainWindow;
    }
}

export default new WindowManager();