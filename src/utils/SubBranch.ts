import { CompeteTeam } from "@data/Tournament";
import { isOdd, splitArray } from "./math";

export interface CompeteAthlete {
    name: string;
    teamName: string;
    isSeeded: boolean;
}

export class SubBranch {
    public name: string;
    private competeTeams: CompeteTeam[]
    private subBranch: SubBranch[];

    constructor(name: string, competeTeams: CompeteTeam[]) {
        this.name = name;
        this.competeTeams = JSON.parse(JSON.stringify(competeTeams)) as CompeteTeam[];
        this.subBranch = [];
    }

    childTo(subBranch: SubBranch) {
        subBranch.subBranch.push(this);
    }

    split(isRoot: boolean) {
        //Find out which team has seeded member
        const seededTeams = this.competeTeams.filter(team => {
            return team.members.findIndex(member => member.seeded) > -1
        });
        const seededTeamNames = seededTeams.map(team => team.name);
        const otherTeams = this.competeTeams.filter(team => !seededTeamNames.includes(team.name));

        // Create empty normal teams for the 2 branches:
        const normalTeam_01: CompeteTeam[] = otherTeams.map(team => ({
            ...team,
            members: [],
        }));
        const normalTeam_02: CompeteTeam[] = otherTeams.map(team => ({
            ...team,
            members: [],
        }));
        // Fill up member for normal teams:
        otherTeams.map(team => {
            const [first, second] = splitArray(team.members);
            normalTeam_01.find(_team => _team.name === team.name).members = first;
            normalTeam_02.find(_team => _team.name === team.name).members = second;
        });

        // Create empty seeded teams for the 2 branches"
        const seededTeam_01: CompeteTeam[] = seededTeams.map(team => ({
            ...team,
            members: [],
        }));
        const seededTeam_02: CompeteTeam[] = seededTeams.map(team => ({
            ...team,
            members: [],
        }));

        // First, distribute equally the seeded members among 2 branch:
        seededTeams.map((team, index) => {
            const seededMember = team.members.find(member => member.seeded);
            if (isOdd(index)) {
                seededTeam_01.find(_team => _team.name === team.name).members.push(seededMember);
            } else {
                seededTeam_02.find(_team => _team.name === team.name).members.push(seededMember);
            }
        })

        // Distribute other member in seeded team:
        seededTeams.map(team => {
            const member = team.members.filter(member => !member.seeded);
            const [first, second] = splitArray(member);
            seededTeam_01.find(_team => _team.name === team.name).members
                = seededTeam_01.find(_team => _team.name === team.name).members.concat(first);
            seededTeam_02.find(_team => _team.name === team.name).members
                = seededTeam_02.find(_team => _team.name === team.name).members.concat(second);

        });

        // combined seeded team and normal team;
        const combined_01 = normalTeam_01.concat(seededTeam_01);
        const combined_02 = normalTeam_02.concat(seededTeam_02);

        const firstBranch = new SubBranch('', combined_01);
        const secondBranch = new SubBranch('', combined_02);
        firstBranch.name = isRoot ? 'Nhánh 1' : `${this.name}.1`;
        secondBranch.name = isRoot ? 'Nhánh 2' : `${this.name}.2`;
        firstBranch.childTo(this);
        secondBranch.childTo(this);
        if (firstBranch.splitable) {
            firstBranch.split(false);
        }
        if (secondBranch.splitable) {
            secondBranch.split(false);
        }
    }

    iterate(branchList?: SubBranch[]) {
        let list = branchList || [];
        if (this.subBranch.length > 0) {
            list = list.concat(this.subBranch[0].iterate(list));
            list = list.concat(this.subBranch[1].iterate(list));
            return this.subBranch;
        }
    }

    get distributedTeams() {
        return this.competeTeams;
    }

    get splitable() {
        let total = 0;
        this.competeTeams.map(team => {
            total += team.members.length;
        })
        return total > 32;
    }
}