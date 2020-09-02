import { MagAction, MagState } from "./magnetronGameTypes"
import { useCallback, useEffect, useState } from "react"
import * as api from "./gameServerApi"
import { getAccessTokenCookie, useGameAccessible } from "./helpers"

export type UseGameServerHost = {
    gameAccessible: boolean | undefined
    state: MagState | undefined
    possibleActions: MagAction[]
}

export default (pin: string): UseGameServerHost => {
    const accessToken = getAccessTokenCookie()

    const gameAccessible = useGameAccessible("GAME", pin, accessToken)
    // const [connectedPlayerNames, setConnectedPlayerNames] = useState<string[]>([])
    const [state, setState] = useState<MagState | undefined>(undefined)
    const [possibleActions, setPossibleActions] = useState<MagAction[]>([])

    useEffect(() => {
        if (accessToken && pin && gameAccessible) {
            api.gameState(accessToken, pin).then((state) => setState(state))
            api.possibleActions(accessToken, pin).then((actions) => setPossibleActions(actions))
        }
    }, [accessToken, pin, gameAccessible])

    return {
        gameAccessible: gameAccessible,
        state,
        possibleActions,
    }
}
