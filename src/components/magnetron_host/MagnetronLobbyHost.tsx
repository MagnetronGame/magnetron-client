import React from "react"
import styled from "styled-components"
import useGameLobby from "../../services/magnetronServerService/useGameLobby"
import { Redirect } from "react-router-dom"
import Button from "../Button"
import withLobbyAccess from "../withLobbyAccess"

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

const Player = styled.li`
    text-decoration: none;
    font-family: inherit;
`

const MagnetronLobbyHost: React.FC<Props> = ({ accessToken, pin }) => {
    const { connectedPlayers, lobbyReady, gameStartedId, startLobby } = useGameLobby(
        pin,
        accessToken,
    )

    const handleLobbyStartClicked = () => {
        startLobby()
    }

    return gameStartedId ? (
        <Redirect to={`host/game/${gameStartedId}`} />
    ) : (
        <Wrapper>
            <ShowPin id={"showPin"}>{pin}</ShowPin>
            <PlayersArea>
                {connectedPlayers.map((name) => (
                    <Player key={name}>{name}</Player>
                ))}
            </PlayersArea>
            <Button
                buttonType={"red"}
                disabled={!lobbyReady}
                onClick={() => handleLobbyStartClicked()}
            >
                Start!
            </Button>
        </Wrapper>
    )
}

export default withLobbyAccess(MagnetronLobbyHost)
