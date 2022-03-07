import { IPCMainEvents } from "@utils/types";
import { ipcMain, IpcMainEvent, IpcRenderer, IpcRendererEvent, WebContents } from "electron";

type ResponseType<Response> = {
    response: Response;
    sender: WebContents | IpcRenderer;
}

export class IPCMainStream<Request, Response> {
    protected _eventName: string;
    protected _sender: WebContents;
    protected _response: (data: ResponseType<Response>) => void;
    protected _error: (error: any) => void;

    constructor(eventName: string) {
        this._eventName = eventName;
        this._error = null;
        this._response = null;
    }

    listen(
        callback: (e: IpcMainEvent | IpcRendererEvent, payload: Request) => void
    ): Promise<ResponseType<Response>> {
        return new Promise((resolve, reject) => {
            ipcMain.on(this._eventName, callback);
            this._response = resolve;
            this._error = reject;
        });
    }

    unlisten(callback: any) {
        ipcMain.off(this._eventName, callback);
    }

    response(data: ResponseType<Response>) {
        this._response(data);
    }

    error(error: any) {
        this._error(error);
    }
}