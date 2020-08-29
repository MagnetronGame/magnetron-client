import React, { useEffect, useRef } from "react"
import { Magnetron } from "./magnetron"
import { useGameServer } from "../../services/gameServerService"

type Props = {
    style: React.CSSProperties
}

const MagnetronGame: React.FC<Props> = ({ style }) => {
    const rootNode = useRef<HTMLDivElement>(null)
    const magnetron = useRef<Magnetron>(null)

    const { createGame, pin, myTurn, state, possibleActions, performAction } = useGameServer()

    useEffect(() => {
        createGame()
    }, [])

    useEffect(() => {
        if (rootNode.current && state) {
            // @ts-ignore
            magnetron.current = new Magnetron(rootNode.current)
            magnetron.current.startAndLoop(state)
        }
    }, [rootNode, state])

    return <div ref={rootNode} style={{ width: "100%", height: "100%" }}></div>
}

export default MagnetronGame
