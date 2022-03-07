import { saveData } from '@utils/helpers';
import { TableNames } from '@utils/types';
import { v4 as uniqueId } from 'uuid';

export type ModelSchema = {
    id?: string;
    [propsName: string]: any;
}

export class Model<D extends ModelSchema> {
    readonly id: string;
    protected _dataInstance: D;
    protected _tableName: TableNames;

    constructor(initialValue: D | string) {
        if (typeof initialValue !== 'string') {
            this._dataInstance = initialValue;
            this.id = this._dataInstance.id ? this._dataInstance.id : uniqueId();
        } else {
            this.id = initialValue;
        }
    }

    protected reconstruct(id: string): Promise<void> {
        return new Promise(() => { });
    }

    save() {
        // saveData(this._tableName, this._dataInstance);
    }
}
