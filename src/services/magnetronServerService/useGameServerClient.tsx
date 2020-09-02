import { MagAction, MagState } from "./magnetronGameTypes"
import { useCallback, useEffect, useState } from "react"
import * as api from "./gameServerApi"
import { getAccessTokenCookie, useGameAccessible } from "./helpers"

export type UseGameServerClient = {
    gameAccessible: boolean | undefined
    myTurn: boolean
    state: MagState | undefined
    possibleActions: MagAction[]
    performAction: (action: MagAction) => void
}

export default (pin: string, playerIndex: number): UseGameServerClient => {
    const accessToken = getAccessTokenCookie()
    const gameAccessible = useGameAccessible("GAME", pin, accessToken)
    const [myTurn, setMyTurn] = useState<boolean>(false)
    const [state, setState] = useState<MagState | undefined>(undefined)
    const [possibleActions, setPossibleActions] = useState<MagAction[]>([])

    useEffect(() => {
        if (accessToken && pin && gameAccessible) {
            api.gameState(accessToken, pin).then((state) => setState(state))
        }
    }, [accessToken, pin, gameAccessible])

    useEffect(() => {
        if (accessToken && pin && gameAccessible) {
            api.possibleActions(accessToken, pin).then((actions) => setPossibleActions(actions))
        }
    }, [accessToken, pin, gameAccessible, state])

    useEffect(() => {
        if (state) {
            const myTurn = state.avatarTurnIndex === playerIndex
            setMyTurn(myTurn)
        }
    }, [state, playerIndex])

    const performAction = useCallback(
        (action: MagAction) => {
            if (accessToken && pin && gameAccessible && state) {
                api.performAction(accessToken, pin, action).then((state) => setState(state))
            }
        },
        [accessToken, pin, gameAccessible, state],
    )

    return {
        gameAccessible,
        myTurn,
        state,
        possibleActions,
        performAction,
    }
}
