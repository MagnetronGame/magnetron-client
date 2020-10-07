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
    const { lobby } = useGameLobby(pin, accessToken)
    const gameStartedId = lobby?.gameId
    const playerNames = lobby ? lobby.players.map((p) => p.name) : []

    return gameStartedId ? (
        <Redirect to={`/client/game/${gameStartedId}/${playerIndex}`} />
    ) : (
        <div style={{ textAlign: "center" }}>
            In lobby!
            <br />
            <span>{playerNames.join(" ")}</span>
        </div>
    )
}

export default withLobbyAccessAsPlayer(MagnetronLobbyClient)
