import { IPCMainStream } from "@classes/IPCStream";
import { AthleteSchema } from "@data/Athlete";
import { TeamSchema } from "@data/Team";
import { TournamentSchema } from "@data/Tournament";
import { batchUpdate, create, deleteData, fetchAll, fetchBatch, fetchOne, saveData } from "@utils/helpers";
import { IPCResponse, TableNames } from "@utils/types";
import { IpcMainEvent, IpcRenderer, IpcRendererEvent, WebContents } from "electron";

const setUpFetchStream = <T>(tableName: TableNames) => {
    const eventName = `fetch:${tableName}`;
    const stream = new IPCMainStream<string, IPCResponse<T[] | T>>(eventName);
    const callback = (e: IpcMainEvent | IpcRendererEvent, id: string) => {
        try {
            const res = id ? fetchOne<T>(id, tableName) : fetchAll<T>(tableName);
            stream.response({
                sender: e.sender,
                response: {
                    status: 'success',
                    data: res
                },
            });
        } catch (err) {
            console.log(err);
        }
    }
    stream.listen(callback).then(data => {
        data.sender.send(`${eventName}/response`, data.response);
        stream.unlisten(callback);
        setUpFetchStream<T>(tableName);
    }).catch(error => {
        console.log(error);
    })
}

const setUpFetchBatchStream = <T>(tableName: TableNames) => {
    const eventName = `fetchBatch:${tableName}`;
    const stream = new IPCMainStream<string[], IPCResponse<T[]>>(eventName);
    const callback = (e: IpcMainEvent | IpcRendererEvent, idList: string[]) => {
        try {
            const res = fetchBatch<T>(tableName, idList);
            stream.response({
                sender: e.sender,
                response: {
                    status: 'success',
                    data: res
                },
            });
        } catch (err) {
            console.log(err);
        }
    }
    stream.listen(callback).then(data => {
        data.sender.send(`${eventName}/response`, data.response);
        stream.unlisten(callback);
        setUpFetchBatchStream<T>(tableName);
    }).catch(error => {
        console.log(error);
    })
}

const setUpSaveStream = <T>(tableName: TableNames) => {
    const eventName = `save:${tableName}`;
    const stream = new IPCMainStream<T, IPCResponse<T>>(eventName);
    const callback = (e: IpcMainEvent | IpcRendererEvent, data: T) => {
        try {
            saveData<T>(tableName, data);
            stream.response({
                sender: e.sender,
                response: {
                    status: 'success',
                    data,
                },
            })
        } catch (err) {
            console.log(err);
        }
    }

    stream.listen(callback).then(data => {
        console.log('saveeee dataaaa', data);
        data.sender.send(`${eventName}/response`, data.response);
        stream.unlisten(callback);
        setUpSaveStream(tableName);
    }).catch(error => {
        console.log(error);
    })
}

const setUpSaveBatchStream = <T>(tableName: TableNames) => {
    const eventName = `saveBatch:${tableName}`;
    const stream = new IPCMainStream<T[], IPCResponse<T[]>>(eventName);
    const callback = (e: IpcMainEvent | IpcRendererEvent, data: T[]) => {
        try {
            batchUpdate<T>(tableName, data);
            stream.response({
                sender: e.sender,
                response: {
                    status: 'success',
                    data,
                },
            })
        } catch (err) {
            console.log(err);
        }
    }

    stream.listen(callback).then(data => {
        data.sender.send(`${eventName}/response`, data.response);
        stream.unlisten(callback);
        setUpSaveBatchStream(tableName);
    }).catch(error => {
        console.log(error);
    })
}

const setUpCreateData = (tableName: TableNames) => {
    const eventName = `create:${tableName}`;
    const stream = new IPCMainStream<any[], IPCResponse<any[]>>(eventName);
    const callback = (e: IpcMainEvent | IpcRendererEvent, data: any[]) => {
        try {
            create(tableName, data);
            stream.response({
                sender: e.sender,
                response: {
                    status: 'success',
                    data,
                },
            })
        } catch (err) {
            console.log(err);
        }
    }

    stream.listen(callback).then(data => {
        data.sender.send(`${eventName}/response`, data.response);
        stream.unlisten(callback);
        setUpCreateData(tableName);
    }).catch(error => {
        console.log(error);
    })
}

const setUpDeleteStream = <T>(tableName: TableNames) => {
    const eventName = `delete:${tableName}`;
    const stream = new IPCMainStream<string, IPCResponse<T>>(eventName);
    const callback = (e: IpcMainEvent | IpcRendererEvent, id: string) => {
        try {
            deleteData<T>(tableName, id);
            stream.response({
                sender: e.sender,
                response: {
                    status: 'success',
                },
            })
        } catch (err) {
            console.log(err);
        }
    }

    stream.listen(callback).then(data => {
        data.sender.send(`${eventName}/response`, data.response);
        stream.unlisten(callback);
        setUpDeleteStream(tableName);
    }).catch(error => {
        console.log(error);
    })
}

export const setUpFetchTeam = () => {
    setUpFetchStream<TeamSchema | TeamSchema[]>('TEAMS');
    setUpSaveStream<TeamSchema>('TEAMS');
    setUpCreateData('MATCHES');
    setUpFetchStream<any>('MATCHES');
    setUpDeleteStream('MATCHES');
    setUpFetchBatchStream<AthleteSchema>('TEAMS');

    setUpFetchStream<AthleteSchema | AthleteSchema[]>('ATHLETES');
    setUpSaveStream<AthleteSchema>('ATHLETES');
    setUpDeleteStream<AthleteSchema>('ATHLETES');
    setUpFetchBatchStream<AthleteSchema>('ATHLETES');
    setUpSaveBatchStream<AthleteSchema>('ATHLETES');

    setUpFetchStream<TournamentSchema | TournamentSchema[]>('TOURNAMENTS');
    setUpSaveStream<TournamentSchema>('TOURNAMENTS');
}

