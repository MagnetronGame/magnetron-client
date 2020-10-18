import styled from "styled-components"
import { PieceComp } from "../../../MagnetronGame2d/pieces"

export const Wrapper = styled.div<{ playerIndex: number }>`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 20px;
    border: 5px solid black;
    border-radius: 15px;
    background-color: ${(props) => props.theme.board.edgeColor}99;

    display: grid;
    grid-template:
        "name" auto
        "coins" 15%
        "." 1fr
        "hand" 33%
        / 100%;
`

export const PlayerBoxName = styled.h3`
    grid-area: name;
    margin: 0;
    padding: 0;
    font-family: ${(props) => props.theme.fonts.types.cool};
    font-size: ${(props) => props.theme.fonts.sizes.medium};
`

export const PlayerBoxCoinRow = styled.div`
    grid-area: coins;
    justify-self: end;
    align-self: stretch;
    display: flex;
`

export const PlayerBoxHandRow = styled.div`
    grid-area: hand;
    justify-self: stretch;
    display: flex;
    //align-items: stretch;
    justify-content: center;
`

export const HandPieceWrapper = styled.span``

export const StyledHandPiece = styled(PieceComp)`
    min-width: 0;
    min-height: 0;
    width: 100%;
    height: 100%;
`
