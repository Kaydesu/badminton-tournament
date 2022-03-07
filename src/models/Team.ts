import { fetchOne } from "@utils/helpers";
import { Athlete } from "./Athlete";
import { Model } from "./DataModel"

export interface TeamInfo {
    owner: string;
    phone: string;
    address: string;
}

export interface TeamSchema {
    id?: string;
    teamName: string;
    info: TeamInfo;
    members?: string[];
}

export class Team extends Model<TeamSchema> {
    private _members: Map<string, Athlete> = new Map();

    constructor(instance: TeamSchema | string) {
        super(instance);
        this._tableName = 'TEAMS';
        this._members = new Map();
        if (typeof instance === 'string') {
            this.reconstruct(instance);
        }
    }

    get teamName() {
        return this._dataInstance.teamName;
    }

    get info() {
        return this._dataInstance.info;
    }

    protected reconstruct(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const data = fetchOne<TeamSchema>(this.id, this._tableName);
                data.members.forEach(id => {
                    this._members.set(id, new Athlete(id.toString()));
                });
                resolve();
            } catch (error) {
                reject(`Cannot find ${id} in table <TEAMS_TABLE>`)
            }
        })
    }

    getMembers(): Athlete[] {
        const list: Athlete[] = [];
        this._members.forEach(value => list.push(value));
        return list;
    }

    getMemberById(id: string) {
        return this._members.get(id);
    }
}