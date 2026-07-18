export interface Game {
  players: Player[]
  rounds: Round[]
  missions: Mission[]
  result?: Result
}

export enum Result {
  GoodWins,
  BadWins,
  MerlinSabotaged
}

export interface Player {
  id: number
  name: string
}

export interface Round {
  id: Number
  leader: Player
  selectedPlayers: Player[]
  voting: Voting
  mission?: Mission
}

export interface Mission {
  roundId: Number
  selectedPlayers: Player[]
  numFails: number
}

export enum Card {
  Success,
  Fail
}

export interface Voting {
  approved: Player[]
  rejected: Player[]
}

export function createGame({ players }: { players: string[] }): Game {
  let game: Game = { players: [], rounds: [], missions: [] }
  for (let i = 0; i < players.length; i++) {
    game.players.push({
      id: i,
      name: players[i]
    })
  }
  return game
}

export function createRound({ id, leader, selectedPlayers, voting, mission }: Round) {
  return {
    id,
    leader,
    selectedPlayers,
    voting,
    mission
  }
}
