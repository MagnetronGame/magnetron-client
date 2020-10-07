import React from "react"
import styled from "styled-components"
import useGameLobby from "../../services/magnetronServerService/useGameLobby"
import { Redirect } from "react-router-dom"
import Button from "../Button"
import withLobbyAccess from "../withLobbyAccess"
import { range } from "../../utils/arrayUtils"

type Props = {
    accessToken: string
    pin: string
}

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 64px 1fr 1fr 1fr;
    grid-template-areas:
        "top-bar top-bar top-bar"
        ". show-pin ."
        ". players ."
        ". start ."
        ". . .";
    justify-items: center;
    align-items: center;
    font-family: "Roboto", sans-serif;
`

const ShowPin = styled.div`
    grid-area: show-pin;
    font-family: "Krona One", sans-serif;
    font-size: 64px;
`

const PlayersArea = styled.ol`
    grid-area: players;
    list-style: none;
    padding-left: 0;
`

const StartArea = styled.div`
    grid-area: start;
`

const Player = styled.li`
    text-decoration: none;
    font-family: inherit;
`

const AddBotButton = styled.button`
    color: #00000066;
    text-decoration: none;
    border: none;
    background: none;
    &:hover {
        color: #000000bb;
    }
`

const MagnetronLobbyHost: React.FC<Props> = ({ accessToken, pin }) => {
    const { lobby, startLobby, addBot } = useGameLobby(pin, accessToken)
    const gameStartedId = lobby?.gameId
    const playerNames = lobby ? lobby.players.map((p) => p.name) : []

    const handleLobbyStartClicked = () => {
        if (lobby?.isReady) {
            startLobby()
        }
    }

    const handleAddBotClicked = () => {
        addBot(1)
    }

    return gameStartedId ? (
        <Redirect to={`/host/game/${gameStartedId}`} />
    ) : (
        <Wrapper>
            <ShowPin id={"showPin"}>{pin}</ShowPin>
            <PlayersArea>
                {lobby &&
                    range(lobby.maxPlayerCount).map((i) => (
                        <Player key={i}>
                            {playerNames.length > i ? (
                                playerNames[i]
                            ) : (
                                <AddBotButton onClick={() => handleAddBotClicked()}>
                                    Add bot
                                </AddBotButton>
                            )}
                        </Player>
                    ))}
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
