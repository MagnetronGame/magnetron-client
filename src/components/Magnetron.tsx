import React, { useEffect } from "react"
import { useGameServer } from "../services/gameServerService"
import MagnetronGame2d from "./MagnetronGame2d"

const Magnetron = () => {
    const { createGame, pin, myTurn, state, possibleActions, performAction } = useGameServer()

    useEffect(() => {
        createGame()
    }, [])

    return (
        <div style={{ height: "100%" }}>
            {state ? (
                <MagnetronGame2d
                    magState={state}
                    possibleMagActions={possibleActions}
                    onMagAction={(action) => console.log(action)}
                />
            ) : (
                <span>Waiting for server</span>
            )}
        </div>
    )
}

export default Magnetron
