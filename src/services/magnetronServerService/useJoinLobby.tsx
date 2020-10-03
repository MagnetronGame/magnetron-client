import React, { useCallback, useState } from "react"
import * as lobbyApi from "./api/lobby"
import { Access } from "./helpers"
import { cookies } from "../cookies"

export default (
    pin: string,
): {
    joinAttempted: boolean
    joinLobby: (name: string) => void
    lobbyAccess: Access
    playerIndex?: number
} => {
    const [joinAttempted, setJoinAttempted] = useState<boolean>(false)
    const [lobbyAccess, setLobbyAccess] = useState<Access>(Access.CHECKING)
    const [playerIndex, setPlayerIndex] = useState<number | undefined>(undefined)

    const joinLobby = useCallback(
        (name: string) => {
            setJoinAttempted(true)
            lobbyApi
                .joinLobby(pin, name)
                .then(({ pin: _pin, accessToken: _accessToken, playerIndex: _playerIndex }) => {
                    cookies.accessToken.set(_accessToken)
                    setPlayerIndex(_playerIndex)
                    setLobbyAccess(Access.ACCESSIBLE)
                })
                .catch((err) => setLobbyAccess(Access.NOT_ACCESSIBLE))
        },
        [pin],
    )

    return {
        joinAttempted,
        joinLobby,
        lobbyAccess,
        playerIndex,
    }
}
