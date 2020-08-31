import { MagAction, MagState } from "./magnetronGameTypes"
import { useEffect, useState } from "react"
import * as api from "./gameServerApi"

export type UseGameServer = {
    createGame: () => void
    pin: string | undefined
    myTurn: boolean
    state: MagState | undefined
    possibleActions: MagAction[]
    performAction: (action: MagAction) => void
}

export const useGameServer = (): UseGameServer => {
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

    const createGame = () => {
        api.createGame().then((_pin) => setPin(_pin))
    }

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
        createGame,
        pin,
        myTurn,
        state,
        possibleActions,
        performAction,
    }
}
