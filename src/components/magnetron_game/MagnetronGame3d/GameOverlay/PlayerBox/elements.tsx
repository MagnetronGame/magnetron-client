import styled from "styled-components"
import { PieceComp } from "../../../MagnetronGame2d/pieces"

export const Wrapper = styled.div<{ playerIndex: number }>`
    width: 100%;
    height: 100%;
    border: 5px solid black;
    border-radius: 15px;
    background-color: #e5e5e5;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
`

export const PlayerBoxName = styled.h3`
    flex: 0 0 33%;
    margin: 0;
    padding: 0;
    font-family: ${(props) => props.theme.fonts.types.cool};
    font-size: ${(props) => props.theme.fonts.sizes.medium};
`

export const PlayerBoxCoinRow = styled.div`
    flex: 0 0 33%;
    display: flex;
`

export const PlayerBoxHandRow = styled.div`
    flex: 0 1 33%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
`

export const StyledHandPiece = styled(PieceComp)<{ maxHandSize: number }>`
    flex: 0 1 ${(props) => 100 / props.maxHandSize}%;
    max-width: 100%;
    max-height: 100%;
`
