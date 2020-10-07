import React, { useCallback, useState } from "react"
import * as lobbyApi from "./api/lobby"
import { Access } from "./helpers"
import { JoinLobbyResponse } from "./types/serverTypes"

export default (
    pin: string,
): {
    joinLobby: (name: string) => void
    lobbyAccess?: Access
    accessToken?: string
    playerIndex?: number
} => {
    const [joinLobbyData, setJoinLobbyData] = useState<JoinLobbyResponse | undefined>(undefined)
    const [lobbyAccess, setLobbyAccess] = useState<Access | undefined>(undefined)

    const joinLobby = useCallback(
        (name: string) => {
            setLobbyAccess(Access.CHECKING)
            lobbyApi
                .joinLobby(pin, name)
                .then((data) => {
                    setJoinLobbyData(data)
                    setLobbyAccess(Access.ACCESSIBLE)
                })
                .catch(() => setLobbyAccess(Access.NOT_ACCESSIBLE))
        },
        [pin],
    )

    return {
        joinLobby,
        lobbyAccess,
        accessToken: joinLobbyData?.accessToken,
        playerIndex: joinLobbyData?.playerIndex,
    }
}
