export enum WINDOW_NAME {
    CREATE_TOURNAMENT = 'createTournament',
    TEAM_MANAGEMENT = 'teamManagement',
}


export enum TOURNAMENT_STATUS {
    INITIAL = 'initial',
    COMPETE = 'compete',
    PENDING = 'pending',
}

export interface TournamentSummary {
    id: string;
    name: string;
    age: number;
    host: string;
    participants: number;
}

export type Sex = 'MALE' | 'FEMALE';