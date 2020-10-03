import { useCallback, useEffect, useState } from "react"
import * as gameApi from "./api/gameSession"
import { useGameStateUpdate } from "./gameServerNotifications"
import { GameStateView } from "./types/serverTypes"
import { MagAction } from "./types/gameTypes/actionTypes"

type UseGameServer = {
    stateView: GameStateView | undefined
    possibleActions: MagAction[]
    performAction: (action: MagAction) => void
}

export default (accessToken: string, gameId: string, role: "HOST" | number): UseGameServer => {
    const [stateView, setStateView] = useState<GameStateView | undefined>(undefined)
    const [possibleActions, setPossibleActions] = useState<MagAction[]>([])

    useGameStateUpdate(accessToken, gameId, role, (stateView) => setStateView(stateView), [])

    useEffect(() => {
        if (stateView) {
            gameApi
                .possibleActions(accessToken, gameId)
                .then((actions) => setPossibleActions(actions))
        }
    }, [accessToken, gameId, stateView])

    const performAction = useCallback(
        (action: MagAction) => {
            if (stateView) {
                gameApi
                    .performAction(accessToken, gameId, action)
                    .catch(() => console.log("Could not perform action :("))
            }
        },
        [accessToken, gameId, stateView],
    )

    return {
        stateView,
        possibleActions,
        performAction,
    }
}
