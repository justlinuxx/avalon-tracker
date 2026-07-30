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

    add_round(round: Round) {
        this.rounds.push(round)
        console.log(round)
        if (round.mission) this.missions.push(round.mission)
    }

    to_json(): string {
        return JSON.stringify({
            players: this.players,
            rounds: $state.snapshot(this.rounds),
            missions: this.missions
        }, replacer)
    }

    static load_from_json(json: string): Game {
        console.log(JSON.parse(json, reviver))
        return new Game(JSON.parse(json, reviver))
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
    Approve = "Approve",
    Reject = "Reject"
}

export type Voting = Map<number, Vote>

export function createRound({ id, leader, selected_players, voting, mission }: Round) {
    return {
        id,
        leader,
        selected_players,
        voting,
        mission
    }
}

function replacer(key: any, value: any) {
    if (value instanceof Map) {
        return value.entries().toArray()
    }
    return value
}

function reviver(key: any, value: any) {
    if (key == "voting") {
        return new Map(value)
    }
    if (value == "Approve") {
        console.log('approved!!!!')
        return Vote.Approve
    }
    if (value == "Reject") {
        console.log('rejected!!!!')
        return Vote.Reject
    }
    return value
}
