export interface CompeteTeam {
    name: string;
    members: string[];
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