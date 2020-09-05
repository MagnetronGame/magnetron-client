import React from "react"
import { useRouteMatch, Redirect } from "react-router-dom"
import useGameLobby from "../../services/magnetronServerService/useGameLobby"
import { Access } from "../../services/magnetronServerService/helpers"

const MagnetronLobbyClient = () => {
    const { pin, playerIndex: playerIndexStr } = useRouteMatch<{
        pin: string
        playerIndex: string
    }>().params
    const playerIndex = parseInt(playerIndexStr)

    const { lobbyAccess, gameStarted, connectedPlayers } = useGameLobby(pin)

    const message =
        lobbyAccess === Access.CHECKING
            ? "Rwo sec..."
            : lobbyAccess === Access.NOT_ACCESSIBLE
            ? "Could not enter lobby"
            : "In lobby! Waiting for host"

    return gameStarted ? (
        <Redirect to={`/client/game/${pin}/${playerIndex}`} />
    ) : (
        <div style={{ textAlign: "center" }}>
            {message}
            <br />
            <span>{connectedPlayers}</span>
        </div>
    )
}

export default MagnetronLobbyClient
