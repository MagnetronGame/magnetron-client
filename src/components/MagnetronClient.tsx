import React, { useEffect, useState } from "react"
import MagnetronGame2d from "./MagnetronGame2d"
import { useGameServerAsClient } from "../services/gameServerService"
import { useLocation } from "react-router-dom"

type Props = {}

const MagnetronClient: React.FC<Props> = () => {
    const { joinGame, pin, myTurn, state, possibleActions, performAction } = useGameServerAsClient()
    const location = useLocation()
    const pathname = location.pathname
    const pathParts = pathname.split("/").filter((p) => p !== "")
    const joinPin = pathParts[pathParts.length - 1]

    useEffect(() => {
        joinGame(joinPin)
    }, [joinPin, joinGame])

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

export default MagnetronClient
