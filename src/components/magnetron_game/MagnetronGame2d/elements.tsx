import styled from "styled-components"
import MagnetronTheme from "../../../MagnetronTheme"
import { PieceComp } from "./pieces"
import { shade } from "../../../utils/colors"

const CELL_COLOR = shade(-0.15, MagnetronTheme.board.baseColor)
const ACTIVE_CELL_COLOR = MagnetronTheme.board.baseColor
const CHOSEN_CELL_COLOR = "#ddf883"

export const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

export const BoardGrid = styled.div<{ boardWidth: number; boardHeight: number }>`
    height: 100vmin;
    width: 100vmin;
    display: grid;
    grid-template-columns: repeat(${(props) => props.boardWidth}, minmax(0, 1fr));
    grid-template-rows: repeat(${(props) => props.boardHeight}, minmax(0, 1fr));
`

export const BoardCell = styled.div<{
    boardX: number
    boardY: number
    active?: boolean
    chosen?: boolean
}>`
    grid-column: ${(props) => props.boardX + 1};
    grid-row: ${(props) => props.boardY + 1};

    background-color: ${(props) => (props.active ? ACTIVE_CELL_COLOR : CELL_COLOR)};
    ${(props) => (props.chosen ? `box-shadow: inset 0px 0px 40px 0px ${CHOSEN_CELL_COLOR}` : null)};
    border: 2px solid ${MagnetronTheme.board.edgeColor};
`

export const CellPieceWrapper = styled.div`
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: center;
`

export const HandContainer = styled.div<{ disabled?: boolean }>`
    flex: 1 1;
    //width: 100%;
    //height: inherit;
    border: 3px solid #10588d;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => (props.disabled ? "gray" : "none")};
`

export const HandPieceWrapper = styled.div<{ handPieceWidthRatio: number }>`
    box-sizing: border-box;
    flex: 1 1;
    max-width: ${(props) => props.handPieceWidthRatio * 100}%;
    padding: 10px;
    display: flex;
    justify-content: center;
`

export const StyledPieceComp = styled(PieceComp)<{ active?: boolean }>`
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    ${(props) => props.active && `box-shadow: 0px 0px 20px 3px ${CHOSEN_CELL_COLOR}`};
`
