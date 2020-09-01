import React, { useEffect, useState } from "react"
import MagnetronGame3d from "../MagnetronGame3d"
import { useGameServerAsHost } from "../../services/gameServerService"
import GameSetup from "./GameLobby"
import { useRouteMatch } from "react-router-dom"

type Props = {
    shouldCreateGame: boolean
}

type RouterMatch = {
    pin: string
}

const MagnetronHost: React.FC<Props> = ({ shouldCreateGame }) => {
    const urlPin = useRouteMatch<RouterMatch>().params.pin
    const { createGame, pin, state, possibleActions, performAction } = useGameServerAsHost(urlPin)

    useEffect(() => {
        if (shouldCreateGame) {
            createGame()
        }
    }, [createGame, shouldCreateGame])

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
