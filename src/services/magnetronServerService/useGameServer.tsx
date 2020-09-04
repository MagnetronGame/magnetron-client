import { MagAction, MagState } from "./magnetronGameTypes"
import { useCallback, useEffect, useState } from "react"
import * as api from "./gameServerApi"
import { Access, getAccessTokenCookie } from "./helpers"
import { useGameStateUpdate } from "./gameServerNotifications"

type UseGameServer = {
    gameAccess: Access
    state: MagState | undefined
    possibleActions: MagAction[]
    performAction: (action: MagAction) => void
}

export default (pin: string, role: "HOST" | number): UseGameServer => {
    const accessToken = getAccessTokenCookie()
    const [gameAccess, setGameAccess] = useState<Access>(
        accessToken ? Access.CHECKING : Access.NOT_ACCESSIBLE,
    )
    const [state, setState] = useState<MagState | undefined>(undefined)
    const [possibleActions, setPossibleActions] = useState<MagAction[]>([])

    useEffect(() => {
        if (accessToken && gameAccess === Access.CHECKING) {
            api.gameExists(accessToken, pin).then((exists) =>
                setGameAccess(exists ? Access.ACCESSIBLE : Access.NOT_ACCESSIBLE),
            )
        }
    }, [pin, accessToken, gameAccess])

    useGameStateUpdate(
        pin,
        useCallback(() => {
            if (accessToken) {
                const playerIndex = role === "HOST" ? undefined : role
                api.gameState(accessToken, pin, playerIndex).then((_state) => setState(_state))
            }
        }, [accessToken, pin, role]),
        true,
    )

    useEffect(() => {
        if (accessToken) {
            api.possibleActions(accessToken, pin).then((actions) => setPossibleActions(actions))
        }
    })

    const performAction = useCallback(
        (action: MagAction) => {
            if (accessToken && pin && gameAccess === Access.ACCESSIBLE && state) {
                api.performAction(accessToken, pin, action).catch(() =>
                    console.log("Could not perform action :("),
                )
            }
        },
        [accessToken, pin, gameAccess, state],
    )

    return {
        gameAccess,
        state,
        possibleActions,
        performAction,
    }
}
