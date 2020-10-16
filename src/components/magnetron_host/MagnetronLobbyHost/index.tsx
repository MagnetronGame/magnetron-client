import React from "react"
import useGameLobby from "../../../services/magnetronServerService/useGameLobby"
import { Redirect } from "react-router-dom"
import Button from "../../Button"
import withLobbyAccess from "../../withLobbyAccess"
import { range } from "../../../utils/arrayUtils"
import { Player, PlayersArea, ShowPin, StartArea, Wrapper } from "./elements"
import AddBotInput from "./AddBotInput"

type Props = {
    accessToken: string
    pin: string
}

const MagnetronLobbyHost: React.FC<Props> = ({ accessToken, pin }) => {
    const { lobby, startLobby, addBot } = useGameLobby(pin, accessToken)
    const gameStartedId = lobby?.gameId
    const playerNames = lobby ? lobby.players.map((p) => p.name) : []

    const handleLobbyStartClicked = () => {
        if (lobby?.isReady) {
            startLobby()
        }
    }

    const handleAddBotClicked = (botLevel: number) => {
        addBot(botLevel)
    }

    return gameStartedId ? (
        <Redirect to={`/host/game/${gameStartedId}`} />
    ) : (
        <Wrapper>
            <ShowPin id={"showPin"}>{pin}</ShowPin>
            <PlayersArea>
                {lobby &&
                    range(lobby.maxPlayerCount).map((i) => (
                        <Player key={i}>{playerNames.length > i ? playerNames[i] : "-"}</Player>
                    ))}
                <AddBotInput onAddBot={(botLevel) => handleAddBotClicked(botLevel)} />
            </PlayersArea>
            <StartArea>
                <Button
                    buttonType={"red"}
                    disabled={!lobby?.isReady}
                    onClick={() => handleLobbyStartClicked()}
                >
                    Start!
                </Button>
            </StartArea>
        </Wrapper>
    )
}

export default withLobbyAccess(MagnetronLobbyHost)
