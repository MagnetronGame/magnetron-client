import { MagAction, MagState } from "./magnetronGameTypes"
import { useCallback, useEffect, useState } from "react"
import * as api from "./gameServerApi"

export type UseGameServerAsHost = {
    createGame: () => void
    pin: string | undefined
    state: MagState | undefined
    possibleActions: MagAction[]
    performAction: (action: MagAction) => void
}

export type UseGameServerAsClient = {
    joinGame: (pin: string) => void
    pin: string | undefined
    myTurn: boolean
    state: MagState | undefined
    possibleActions: MagAction[]
    performAction: (action: MagAction) => void
}

export const useGameServerAsHost = (): UseGameServerAsHost => {
    const [pin, setPin] = useState<string | undefined>(undefined)
    const [hostToken, setHostToken] = useState<string | undefined>(undefined)
    const [state, setState] = useState<MagState | undefined>(undefined)
    const [possibleActions, setPossibleActions] = useState<MagAction[]>([])

    useEffect(() => {
        if (pin) {
            api.gameState(pin).then((state) => setState(state))
            api.possibleActions(pin).then((actions) => setPossibleActions(actions))
        }
    }, [pin])

    const createGame = useCallback(() => {
        api.createGame().then((_pin) => setPin(_pin))
    }, [])

    const performAction = useCallback(
        (action: MagAction) => {
            if (pin && hostToken && state) {
                api.performAction(pin, action).then((state) => {
                    setState(state)
                    api.possibleActions(pin).then((actions) => {
                        setPossibleActions(actions)
                    })
                })
            }
        },
        [pin, hostToken, state],
    )

    return {
        createGame,
        pin,
        state,
        possibleActions,
        performAction,
    }
}

export const useGameServerAsClient = (): UseGameServerAsClient => {
    const [myAvatarIndex] = useState(0)
    const [pin, setPin] = useState<string | undefined>(undefined)
    const [myTurn, setMyTurn] = useState<boolean>(false)
    const [state, setState] = useState<MagState | undefined>(undefined)
    const [possibleActions, setPossibleActions] = useState<MagAction[]>([])

    useEffect(() => {
        if (pin) {
            api.gameState(pin).then((state) => setState(state))
            api.possibleActions(pin).then((actions) => setPossibleActions(actions))
        }
    }, [pin])

    useEffect(() => {
        if (state) {
            const myTurn = state.avatarTurnIndex === myAvatarIndex
            setMyTurn(myTurn)
        }
    }, [state, myAvatarIndex])

    const joinGame = useCallback((_pin: string) => {
        setPin(_pin)
    }, [])

    const performAction = (action: MagAction) => {
        if (pin && state) {
            api.performAction(pin, action).then((state) => {
                setState(state)
                api.possibleActions(pin).then((actions) => {
                    setPossibleActions(actions)
                })
            })
        }
    }

    return {
        joinGame,
        pin,
        myTurn,
        state,
        possibleActions,
        performAction,
    }
}
