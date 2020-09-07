import { useCallback, useEffect, useState } from "react"
import * as api from "./gameServerApi"
import { Access } from "./helpers"
import { useGameStarted, useLobbyGameReady, useLobbyNotification } from "./gameServerNotifications"
import { Simulate } from "react-dom/test-utils"
import { cookies } from "../cookies"

export type UseGameLobby = {
    lobbyAccess: Access
    connectedPlayers: string[]
    gameReady: boolean
    gameStarted: boolean
}
export default (pin: string): UseGameLobby => {
    const accessToken = cookies.accessToken.get()
    const [lobbyAccess, setLobbyAccess] = useState<Access>(
        accessToken ? Access.CHECKING : Access.NOT_ACCESSIBLE,
    )
    const [connectedPlayers, setConnectedPlayers] = useState<string[]>([])
    const [gameReady, setGameReady] = useState<boolean>(false)
    const [gameStarted, setGameStarted] = useState<boolean>(false)

    useEffect(() => {
        if (accessToken) {
            api.lobbyExists(accessToken, pin).then((access) =>
                setLobbyAccess(access ? Access.ACCESSIBLE : Access.NOT_ACCESSIBLE),
            )
        }
    }, [pin, accessToken])

    useLobbyNotification(
        pin,
        () => {
            if (accessToken) {
                const aborter = new AbortController()
                api.getLobby(accessToken, pin, aborter.signal).then((lobby) =>
                    setConnectedPlayers(lobby.players),
                )
                return () => aborter.abort()
            }
        },
        [accessToken, pin],
        true,
    )

    useLobbyGameReady(
        pin,
        () => {
            setGameReady(true)
        },
        [],
    )

    useGameStarted(
        pin,
        () => {
            setGameStarted(true)
        },
        [],
    )

    // Check if game started before we subscribed to notifications
    useEffect(() => {
        let timeoutHandle: number | undefined
        const fetchAborter = new AbortController()
        if (accessToken) {
            timeoutHandle = setTimeout(
                () =>
                    api
                        .gameExists(accessToken, pin, fetchAborter.signal)
                        .then((exists) => setGameStarted(exists))
                        .catch(() => setGameStarted(false)),
                1000,
            )
        }
        return () => {
            if (timeoutHandle !== undefined) {
                clearTimeout(timeoutHandle)
            }
            fetchAborter.abort()
        }
    }, [accessToken, pin])

    return {
        lobbyAccess,
        connectedPlayers,
        gameReady,
        gameStarted,
    }

    // const startGame = useCallback(() => {
    //     if (accessToken && pin) {
    //         api.startGame(accessToken, pin).then((gameStarted) => gameStarted && setGameReady(true))
    //     }
    // }, [accessToken, pin])
    //
    // return {
    //     createGame,
    //     lobbyAccessible,
    //     pin,
    //     connectedPlayers,
    //     startGame,
    //     gameReady,
    // }
}
