import { useCallback, useEffect, useState } from "react"
import * as api from "./gameServerApi"
import Cookies from "universal-cookie"
import { getAccessTokenCookie, setAccessTokenCookie, useGameAccessible } from "./helpers"

export type UseGameLobbyHost = {
    createGame: () => void
    lobbyAccessible: boolean | undefined
    pin?: string // lobby is created if pin exists
    connectedPlayers: string[]
    startGame: () => void
    gameReady: boolean
}
export default (existingPin?: string): UseGameLobbyHost => {
    const [pin, setPin] = useState<string | undefined>(existingPin)
    const [accessToken, setAccessToken] = useState<string | undefined>(() => getAccessTokenCookie())
    const lobbyAccessible = useGameAccessible("LOBBY", pin, accessToken)
    const [connectedPlayers, setConnectedPlayers] = useState<string[]>([])
    const [gameReady, setGameReady] = useState<boolean>(false)

    const createGame = useCallback(() => {
        api.createLobby().then(({ pin: _pin, accessToken: _accessToken }) => {
            setAccessTokenCookie(_accessToken)
            setPin(_pin)
            setAccessToken(_accessToken)
        })
    }, [])

    useEffect(() => {
        if (accessToken && pin) {
            api.getLobby(accessToken, pin).then((lobby) => setConnectedPlayers(lobby.players))
        }
    }, [accessToken, pin])

    // useEffect(() => {
    //     if (accessToken) {
    //         setAccessTokenCookie(accessToken)
    //     }
    // }, [accessToken])

    const startGame = useCallback(() => {
        if (accessToken && pin) {
            api.startGame(accessToken, pin).then((gameStarted) => gameStarted && setGameReady(true))
        }
    }, [accessToken, pin])

    return {
        createGame,
        lobbyAccessible,
        pin,
        connectedPlayers,
        startGame,
        gameReady,
    }
}
