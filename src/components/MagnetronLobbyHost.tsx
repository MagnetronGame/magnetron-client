import React, { useEffect } from "react"
import styled from "styled-components"
import useGameLobbyHost from "../services/magnetronServerService/useGameLobbyHost"
import { useRouteMatch, useHistory } from "react-router-dom"

type Props = {
    shouldCreateLobby?: boolean
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

const MagnetronLobbyHost: React.FC<Props> = ({ shouldCreateLobby }) => {
    const history = useHistory()
    const routeParams = useRouteMatch<{ pin?: string }>().params
    const existingPin = routeParams.pin

    const {
        createGame,
        lobbyAccessible,
        pin,
        connectedPlayers,
        startGame,
        gameReady,
    } = useGameLobbyHost(existingPin)

    useEffect(() => {
        if (shouldCreateLobby) {
            if (!pin) {
                createGame()
            } else {
                history.push(`/host/lobby/${pin}`)
            }
        }
    }, [shouldCreateLobby, pin, createGame, history])

    const message =
        lobbyAccessible === undefined
            ? "Waiting for server..."
            : !lobbyAccessible
            ? `Invalid pin: ${pin}`
            : undefined

    return message ? (
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
