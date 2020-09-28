import { MagState } from "./gameTypes/stateTypes"

export type SessionId = string
export type UserId = string

export type PlayerBot = {
    _type: "PlayerBot"
    name: string
    botLevel: number
}

export type PlayerClient = {
    _type: "PlayerClient"
    name: string
    userId: UserId
}

export type Player = PlayerClient | PlayerBot

export type GameStateView = {
    sessionId: SessionId
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
    playersCount: number
    players: string[]
}
