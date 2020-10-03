import { useCallback, useState } from "react"
import * as lobbyApi from "./api/lobby"
import { GameId } from "./types/serverTypes"
import { useLobbyUpdate } from "./gameServerNotifications"

export type Return = {
    connectedPlayers: string[]
    lobbyReady: boolean
    gameStartedId: GameId | null
    startLobby: () => void
}
export default (pin: string, accessToken: string): Return => {
    const [connectedPlayers, setConnectedPlayers] = useState<string[]>([])
    const [lobbyReady, setLobbyReady] = useState<boolean>(false)
    const [gameStartedId, setGameStartedId] = useState<GameId | null>(null)

    useLobbyUpdate(accessToken || "", pin, (lobby) => {
        setConnectedPlayers(lobby.players.map((p) => p.name))
        if (lobby.isReady) {
            setLobbyReady(true)
        }
        if (lobby.gameId) {
            setGameStartedId(lobby.gameId)
        }
    })

    const startLobby = useCallback(() => {
        lobbyApi.startGame(accessToken, pin).catch(() => console.log("Could not start game"))
    }, [accessToken, pin])

    return {
        connectedPlayers,
        lobbyReady,
        gameStartedId,
        startLobby,
    }
}
