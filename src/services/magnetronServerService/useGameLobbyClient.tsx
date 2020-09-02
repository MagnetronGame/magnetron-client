import { useCallback, useEffect, useState } from "react"
import * as api from "./gameServerApi"
import Cookies from "universal-cookie"
import { getAccessTokenCookie, setAccessTokenCookie } from "./helpers"

export type UseGameLobbyClient = {
    joinLobby: (name: string) => void
    pinValid: boolean | undefined
    lobbyJoined: boolean
    playerIndex?: number
    gameReady: boolean
}

export default (pin: string): UseGameLobbyClient => {
    const [accessToken, setAccessToken] = useState<string | undefined>(() => getAccessTokenCookie())
    const [pinValid, setPinValid] = useState<boolean | undefined>(undefined)
    const [lobbyJoined, setLobbyJoined] = useState<boolean>(false)
    const [playerIndex, setPlayerIndex] = useState<number | undefined>(undefined)
    const [gameReady, setGameReady] = useState<boolean>(false)

    const joinLobby = useCallback(
        (name: string) => {
            setPinValid(undefined) // TODO: This may happen after the following
            api.joinLobby(pin, name)
                .then(({ pin: _pin, accessToken: _accessToken, playerIndex: _playerIndex }) => {
                    setAccessToken(_accessToken)
                    setPlayerIndex(_playerIndex)
                    setPinValid(true)
                    setLobbyJoined(true)
                })
                .catch((err) => setPinValid(false))
        },
        [pin],
    )

    useEffect(() => {
        if (accessToken) {
            setAccessTokenCookie(accessToken)
        }
    }, [accessToken])

    return {
        joinLobby,
        pinValid,
        lobbyJoined,
        playerIndex,
        gameReady,
    }
}
