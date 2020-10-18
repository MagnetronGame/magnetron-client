import { MagState } from "./gameTypes/stateTypes"

export type GameId = string
export type UserId = string

export type PlayerBot = {
    type: "PlayerBot"
    name: string
    botLevel: number
}

export type PlayerClient = {
    type: "PlayerClient"
    name: string
    userId: UserId
}

export type Player = PlayerClient | PlayerBot

export type GameStateView = {
    sessionId: GameId
    players: Player[]
    viewPlayerIndex: number
    currentState: MagState
}

export type CreateLobbyResponse = {
    pin: string
    accessToken: string
}

export type JoinLobbyResponse = {
    pin: string
    accessToken: string
    playerIndex: number
}

export type LobbySession = {
    pin: string
    maxPlayerCount: number
    players: Player[]
    isReady: boolean
    gameId?: GameId
}
