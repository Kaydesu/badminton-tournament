import { IPCMainStream } from "@classes/IPCStream"
import WindowManager from "@classes/WindowManager";
import { TeamSchema } from "@data/Team";
import { TournamentSchema } from "@data/Tournament";
import { fetchAll } from "@utils/helpers";
import { IPCResponse, WINDOW_NAME } from "@utils/types"
import { BrowserWindow } from "electron";
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

const printOptions = {
    silent: false,
    printBackground: true,
    color: true,
    margin: {
        marginType: 'printableArea',
    },
    landscape: false,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    header: 'Page header',
    footer: 'Page footer',
};

export const startPrintStream = () => {
    const stream = new IPCMainStream<string, any>('previewComponent')

    stream.listen((e, url) => {
        let window = new BrowserWindow({ title: 'Preview', show: false, autoHideMenuBar: true }) as any;
        window.loadURL(url);
        console.log(">>>>>>42 Object URL: ", url);

        window.webContents.once('did-finish-load', () => {
            window.webContents.printToPDF(printOptions).then((data: any) => {
                let buf = Buffer.from(data);
                let base64 = buf.toString('base64');
                let url = 'data:application/pdf;base64,' + base64;

                window.webContents.on('ready-to-show', () => {
                    window.show();
                    window.setTitle('Preview');
                });

                window.webContents.on('destroyed', () => {
                    window = null
                });

                console.log('>>>>>>>>>>76 Load base64:', url);

                window.loadURL(url);
            }).catch((error: any) => {
                console.log(error);
            });
        });

    }).then(data => {
        // Fetch data and send to the views
    });


    return stream;
}