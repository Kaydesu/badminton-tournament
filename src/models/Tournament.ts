export interface CompeteMember {
    name: string;
    phone?: string;
    yearOfBirth?: string;
    created: number;
    seedRank: number;
}

export interface CompeteTeam {
    name: string;
    symbol: string;
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
    hostName: string; // team Id
    status: "prepare" | "ready",
    menSingle?: CompetitionFormat,
    womenSingle?: CompetitionFormat,
    menDouble?: CompetitionFormat,
    womenDouble?: CompetitionFormat,
    mixedDouble?: CompetitionFormat,
}

export enum Content {
    MAN_SINGLE = 'manSingle',
    MAN_DOUBLE = 'manDouble',
    WOMAN_SINGLE = 'womanSingle',
    WOMAN_DOUBLE = 'womanDouble',
    MIXED_DOUBLE = 'mixedDouble',
}