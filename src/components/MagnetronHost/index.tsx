import React, { useEffect, useState } from "react"
import MagnetronGame3d from "../MagnetronGame3d"
import { useGameServerAsHost } from "../../services/gameServerService"
import GameSetup from "./GameSetup"
import { useLocation } from "react-router-dom"

const MagnetronHost = () => {
    // const location = useLocation()
    // const pathname = location.pathname
    // const pathParts = pathname.split("/").filter((p) => p !== "")
    // const existingPin = pathParts[pathParts.length - 1]

    const { createGame, pin, state, possibleActions, performAction } = useGameServerAsHost()
    // const state = undefined

    useEffect(() => {
        if (!pin) {
            createGame()
        }
    }, [pin, createGame])

    if (!pin) {
        return <span>Waiting for server</span>
    } else {
        return (
            <div style={{ height: "100%" }}>
                {state ? (
                    <MagnetronGame3d
                        magState={state}
                        possibleMagActions={possibleActions}
                        onMagAction={(action) => console.log("Cannot perform actions on the host")}
                    />
                ) : (
                    <GameSetup
                        pin={pin}
                        connectedPlayers={["Hanna Kai", "Eirik", "Gunnar", "Robert"]}
                    />
                )}
            </div>
        )
    }
}

export default MagnetronHost
