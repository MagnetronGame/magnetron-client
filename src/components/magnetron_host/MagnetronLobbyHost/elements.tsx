import styled from "styled-components"

export const Wrapper = styled.div`
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

export const ShowPin = styled.div`
    grid-area: show-pin;
    font-family: "Krona One", sans-serif;
    font-size: 64px;
`

export const PlayersArea = styled.ol`
    grid-area: players;
    justify-self: center;
    list-style: none;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const StartArea = styled.div`
    grid-area: start;
`

export const Player = styled.li`
    text-decoration: none;
    font-family: inherit;
`
