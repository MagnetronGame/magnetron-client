import { useCallback, useState } from "react"
import * as lobbyApi from "./api/lobby"
import { LobbySession } from "./types/serverTypes"
import { useLobbyUpdate } from "./gameServerNotifications"

export type Return = {
    lobby: LobbySession | undefined
    startLobby: () => void
    addBot: (botLevel: number) => void
}
export default (pin: string, accessToken: string): Return => {
    const [lobby, setLobby] = useState<LobbySession | undefined>(undefined)

    useLobbyUpdate(accessToken, pin, (lobby) => {
        setLobby(lobby)
    })

    const startLobby = useCallback(() => {
        lobbyApi.startGame(accessToken, pin).catch(() => console.log("Could not start game"))
    }, [accessToken, pin])

    const addBot = useCallback(
        (botLevel: number) => {
            if (lobby) {
                lobbyApi.joinLobbyBot(pin, `Bot${lobby.players.length}`, botLevel)
            }
        },
        [pin, lobby],
    )

    return {
        lobby,
        startLobby,
        addBot,
    }
}
