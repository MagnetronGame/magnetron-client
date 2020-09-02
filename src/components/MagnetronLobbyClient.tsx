import React, { useEffect } from "react"
import useGameLobbyClient from "../services/magnetronServerService/useGameLobbyClient"
import { useRouteMatch } from "react-router-dom"

const MagnetronLobbyClient = () => {
    const routeParams = useRouteMatch<{ pin: string }>().params
    const pin = routeParams.pin
    const { joinLobby, pinValid, lobbyJoined, playerIndex, gameReady } = useGameLobbyClient(pin)

    useEffect(() => {
        if (!lobbyJoined) {
            joinLobby("Frank")
        }
    }, [lobbyJoined, joinLobby])

    const message = !pinValid
        ? `Invalid pin: ${pin}`
        : !lobbyJoined
        ? "Waiting for server..."
        : "In lobby! Waiting for host"

    return <div style={{ textAlign: "center" }}>{message}</div>
}

export default MagnetronLobbyClient
