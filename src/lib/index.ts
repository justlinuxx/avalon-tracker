export interface Game {
  players: Player[]
  rounds: Round[]
  missions: Mission[]
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

export function createGame({ players }: { players: string[] }): Game {
  let game: Game = { players: [], rounds: [], missions: [] }
  for (let i = 0; i < players.length; i++) {
    game.players[i] = {
      id: i,
      name: players[i]
    }
  }
  return game
}

export function createRound({ id, leader, selected_players, voting, mission }: Round) {
  return {
    id,
    leader,
    selected_players,
    voting,
    mission
  }
}
