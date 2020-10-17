import styled from "styled-components"

export const Wrapper = styled.div<{ color?: string }>`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${(props) => props.color || "none"};
`

export const OverlayPositioned = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`

export const AvatarPieceName = styled.div<{ x: number; y: number }>`
    position: absolute;
    color: white;
    top: ${(props) => props.y - 8}px;
    left: ${(props) => props.x - 8}px;
    font-family: ${(props) => props.theme.fonts.types.cool};
    font-size: 16px;
`

export const OverlayGrid = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 20% 1fr 20%;
    grid-template-rows: 20% 1fr 20%;
    grid-template-areas:
        "player0 top player1"
        "left middle right"
        "player3 bottom player2";
`

export const PlayerTurnArea = styled.div`
    grid-area: top;
    place-self: center;
`

export const DisplayWinnerArea = styled.div`
    grid-area: middle;
`

export const PlayerBoxArea = styled.div<{ playerIndex: number }>`
    // prettier-ignore
    grid-area: player${(props) => props.playerIndex};
    place-self: stretch;
`

export const DisplayWinner = styled.div<{ color: string }>`
    width: 100%;
    height: 100%;
    color: ${(props) => props.color};
    font-family: ${(props) => props.theme.fonts.types.cool};
    font-size: ${(props) => props.theme.fonts.sizes.large};
    display: flex;
    justify-content: center;
    align-items: start;
`
