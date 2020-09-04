import React from "react"
import styled from "styled-components"
import useGameLobby from "../../services/magnetronServerService/useGameLobby"
import { useHistory, useRouteMatch, Redirect } from "react-router-dom"
import { Access } from "../../services/magnetronServerService/helpers"

type Props = {}

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

const MagnetronLobbyHost: React.FC<Props> = () => {
    const routeParams = useRouteMatch<{ pin: string }>().params
    const pin = routeParams.pin

    const { lobbyAccess, connectedPlayers, gameReady } = useGameLobby(pin || "")

    const message =
        lobbyAccess === Access.CHECKING
            ? "Waiting for server..."
            : lobbyAccess === Access.NOT_ACCESSIBLE
            ? `Invalid pin: ${pin}`
            : undefined

    return gameReady ? (
        <Redirect to={`/host/game/start/${pin}`} />
    ) : message ? (
        <div style={{ textAlign: "center" }}>{message}</div>
    ) : (
        <Wrapper>
            <ShowPin>{pin}</ShowPin>
            <PlayersArea>
                {connectedPlayers.map((name) => (
                    <Player>{name}</Player>
                ))}
            </PlayersArea>
        </Wrapper>
    )
}

export default MagnetronLobbyHost
