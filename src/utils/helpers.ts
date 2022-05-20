import { ModelSchema } from '@data/DataModel';
import fs from 'fs';
import path from 'path';
import { TableNames } from './types';
import { v4 as uniqueId } from 'uuid';

const BASE_URL = path.resolve(__dirname, 'storage/');

export function fetchOne<D extends ModelSchema>(id: string, table: TableNames): D {
    try {
        const data = JSON.parse(readJSON(table)) as D[];
        const instance = data.find(item => item.id === id);
        return instance;
    } catch (err) {
        throw new Error(err);
    }
}

export function fetchBatch<D extends ModelSchema>(table: TableNames, listId: string[]): D[] {
    try {
        const data = JSON.parse(readJSON(table)) as D[];
        const batch = data.filter(item => listId.includes(item.id));
        return batch;
    } catch (err) {
        throw new Error(err);
    }
}

export function fetchAll<D extends ModelSchema>(table: TableNames): D[] {
    try {
        const data = JSON.parse(readJSON(table)) as D[];
        return data;
    } catch (err) {
        throw new Error(err);
    }
}


export function saveData<D extends ModelSchema>(table: TableNames, data: D) {
    try {
        const list = JSON.parse(readJSON(table)) as D[];
        if (data.id) {
            const updateIndex = list.findIndex(item => item.id === data.id);
            if (updateIndex > -1) {
                list[updateIndex] = { ...data };
            }
        } else {
            data.id = `${table}-${uniqueId()}`;
            list.push({ ...data });
        }
        writeJSON(table, list);
    } catch (err) {
        throw new Error(err);
    }
}

export function deleteData<D extends ModelSchema>(table: TableNames, id: string) {
    try {
        const data = JSON.parse(readJSON(table)) as D[];
        const updatedList = data.filter(item => !(item.id === id));
        writeJSON(table, updatedList);
    } catch (err) {
        throw new Error(err);
    }
}

export function batchUpdate<D extends ModelSchema>(
    table: TableNames,
    batch: D[],
) {
    try {
        const list = JSON.parse(readJSON(table)) as D[];
        const updatedList = list.map((data) => {
            const updateIndex = batch.findIndex(item => item.id === data.id)
            if (updateIndex > -1) {
                return batch[updateIndex]
            } else {
                return data;
            }
        })
        writeJSON(table, updatedList);
    } catch (err) {
        throw new Error(err);
    }
}



const readJSON = (table: string) => {
    if (fs.existsSync(`${BASE_URL}/TABLE_${table}.json`)) {
        const res = fs.readFileSync(`${BASE_URL}/TABLE_${table}.json`);
        return JSON.parse(JSON.stringify(res.toString()));
    } else {
        fs.mkdir(BASE_URL, () => {
            writeJSON(table, []);
        })
    }

}

const writeJSON = (table: string, json: any) => {
    try {
        fs.writeFileSync(`${BASE_URL}/TABLE_${table}.json`, JSON.stringify(json));
    } catch (err) {
        throw new Error(err);
    }
}

