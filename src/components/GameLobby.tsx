import React from "react"
import styled from "styled-components"

type Props = {
    pin: string
    connectedPlayers: string[]
}

const Wrapper = styled.div`
    height: 100%;
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

const GameLobby: React.FC<Props> = ({ pin, connectedPlayers }) => {
    return (
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

export default GameLobby
