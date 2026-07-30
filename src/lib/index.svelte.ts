export interface GameInterface {
    players: Player[]
    rounds: Round[]
    missions: Mission[]
}

export class Game implements GameInterface {
    players: Player[]
    rounds: Round[]
    missions: Mission[]

    constructor(game: Partial<GameInterface>) {
        this.players = game.players || []
        this.rounds = $state(game.rounds || [])
        this.missions = game.missions || []
    }

    add_round = (round: Round) => {
        this.rounds.push(round)
        if (round.mission) this.missions.push(round.mission)
    }
}

export interface Player {
    id: number
    name: string
}

export interface Round {
    id: number
    leader: Player
    selected_players: Player[]
    voting: Voting
    mission?: Mission
}

export interface Mission {
    round_id: number
    selected_players: Player[]
    num_fails: number
}

export enum Vote {
    Approve,
    Reject
}

export type Voting = Map<Player, Vote>

export function createRound({ id, leader, selected_players, voting, mission }: Round) {
    return {
        id,
        leader,
        selected_players,
        voting,
        mission
    }
}
