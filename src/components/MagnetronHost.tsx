import React, { useEffect, useState } from "react"
import MagnetronGame2d from "./MagnetronGame2d"
import { useGameServerAsHost } from "../services/gameServerService"

const MagnetronHost = () => {
    const { createGame, pin, state, possibleActions, performAction } = useGameServerAsHost()

    useEffect(() => {
        createGame()
    }, [createGame])

    return (
        <div style={{ height: "100%" }}>
            {state ? (
                <MagnetronGame2d
                    magState={state}
                    possibleMagActions={possibleActions}
                    onMagAction={(action) => performAction(action)}
                />
            ) : (
                <span>Waiting for server</span>
            )}
        </div>
    )
}

export default MagnetronHost
