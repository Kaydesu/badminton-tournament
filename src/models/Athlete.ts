import { fetchOne } from "@utils/helpers";
import { Sex } from "@utils/types";
import { Model } from "./DataModel";
import { Team, TeamSchema } from "./Team";

export interface AthleteSchema {
    id?: string;
    name: string;
    sex: Sex;
    teamId: string;
}

export class Athlete extends Model<AthleteSchema> {
    private _team: Team;
    constructor(instance: AthleteSchema | string) {
        super(instance);
        this._tableName = 'ATHLETES';
        if(typeof instance === 'string') {
            this.reconstruct(instance);
        }
    }

    get name() {
        return this._dataInstance.name;
    }

    get sex() {
        return this._dataInstance.sex;
    }

    get team() {
        return this._team;
    }

    protected reconstruct(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const data = fetchOne<AthleteSchema>(this.id, this._tableName);
                const teamData = fetchOne<TeamSchema>(data.teamId, 'TEAMS');
                const { id, teamName, info, members } = teamData;
                this._team = new Team({
                    id,
                    teamName,
                    info,
                    members
                });
                resolve();
            } catch (error) {
                reject(`Cannot find ${id} in table <ATHLETE_TABLE>`)
            }
        })
    }
}