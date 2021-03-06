import { MagAction, MagState, MagStatePlayerView } from "./magnetronGameTypes"
import { useCallback, useEffect, useState } from "react"
import * as api from "./gameServerApi"
import { Access } from "./helpers"
import { useGameStateUpdate } from "./gameServerNotifications"
import { cookies } from "../cookies"

type UseGameServer = {
    gameAccess: Access
    state: MagState | undefined
    possibleActions: MagAction[]
    performAction: (action: MagAction) => void
}

export default (pin: string, role: "HOST" | number): UseGameServer => {
    const accessToken = cookies.accessToken.get()
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
        accessToken || "",
        pin,
        role,
        (state) => {
            if ((state as MagStatePlayerView).playerIndex !== undefined) {
                setState((state as MagStatePlayerView).state)
            } else {
                setState(state as MagState)
            }
        },
        [],
    )

    useEffect(() => {
        if (accessToken && state) {
            api.possibleActions(accessToken, pin).then((actions) => setPossibleActions(actions))
        }
    }, [accessToken, state])

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
