export interface CompeteMember {
    name: string;
    phone?: string;
    email?: string;
}

export interface CompeteTeam {
    name: string;
    members: CompeteMember[];
}

export interface CompetitionFormat {
    enabled: boolean;
    teams: CompeteTeam[];
}

export interface TournamentSchema {
    id?: string;
    name: string;
    age: number;
    hostId: string; // team Id
    menSingle?: CompetitionFormat,
    womenSingle?: CompetitionFormat,
    menDouble?: CompetitionFormat,
    womenDouble?: CompetitionFormat,
    mixedDouble?: CompetitionFormat,
}

export enum Content {
    MAN_SINGLE = 'mainSingle',
    MAN_DOUBLE = 'mainDouble',
    WOMAN_SINGLE = 'womanSingle',
    WOMAN_DOUBLE = 'womanDouble',
    MIXED_DOUBLE = 'mixedDouble',
}