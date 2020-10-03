import React from "react"
import { Redirect } from "react-router-dom"
import useGameLobby from "../../services/magnetronServerService/useGameLobby"
import withLobbyAccessAsPlayer from "../withLobbyAccessAsPlayer"

type Props = {
    accessToken: string
    pin: string
    playerIndex: number
}

const MagnetronLobbyClient: React.FC<Props> = ({ accessToken, pin, playerIndex }) => {
    const { gameStartedId, connectedPlayers } = useGameLobby(pin, accessToken)

    return gameStartedId ? (
        <Redirect to={`/client/game/${pin}/${gameStartedId}/${playerIndex}`} />
    ) : (
        <div style={{ textAlign: "center" }}>
            In lobby!
            <br />
            <span>{connectedPlayers}</span>
        </div>
    )
}

export default withLobbyAccessAsPlayer(MagnetronLobbyClient)
