import React, { useEffect, useState } from "react"
import { MagAction, MagnetPiece, MagnetType, MagState, Vec2I } from "../services/magnetronGameTypes"
import styled from "styled-components"
import { possibleActions } from "../services/gameServerApi"

type Props = {
    className?: string
    magState: MagState
    possibleMagActions: MagAction[]
    onMagAction: (action: MagAction) => void
}

const GLOW_COLOR = "#d9ff62"
const CELL_COLOR = "#c8e2c2"
const ACTIVE_CELL_COLOR = "#e5ffde"
const CHOSEN_CELL_COLOR = "#ddf883"

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
`

const BoardGrid = styled.div<{ boardWidth: number; boardHeight: number }>`
    height: 80%;
    display: grid;
    grid-template-columns: repeat(${(props) => props.boardWidth}, 1fr);
    grid-template-rows: repeat(${(props) => props.boardHeight}, 1fr);
`

const BoardCell = styled.div<{
    boardX: number
    boardY: number
    active?: boolean
    chosen?: boolean
}>`
    grid-column: ${(props) => props.boardX + 1};
    grid-row: ${(props) => props.boardY + 1};

    background-color: ${(props) => (props.active ? ACTIVE_CELL_COLOR : CELL_COLOR)};
    ${(props) => (props.chosen ? `box-shadow: inset 0px 0px 40px 0px ${CHOSEN_CELL_COLOR}` : null)};
    border: 2px solid black;
`

const HandContainer = styled.div`
    height: 20%;
    border: 3px solid #10588d;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-evenly;
`

const HandPieceWrapper = styled.div`
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 10px;
`

const Piece = styled.div<{ active?: boolean }>`
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    background-color: aquamarine;
    ${(props) => props.active && `box-shadow: inset 0px 0px 20px 3px ${CHOSEN_CELL_COLOR}`};
    border: 1px solid black;
`

const MagnetPieceComp: React.FC<{ magnetPiece: MagnetPiece; glow: boolean }> = ({
    magnetPiece,
    glow,
}) => {
    return <Piece active={glow}>{magnetPiece.magnetType === MagnetType.POSITIVE ? "+" : "-"}</Piece>
}

const MagnetronGame2d: React.FC<Props> = ({
    magState,
    possibleMagActions,
    onMagAction,
    className,
}) => {
    const [chosenCell, setChosenCell] = useState<Vec2I | null>(null)

    useEffect(() => {
        if (chosenCell) {
        }
    }, [chosenCell])

    const handleBoardCellClicked = (x: number, y: number) => {
        console.log("Board clicked: ", x, y)
        if (chosenCell && chosenCell.x === x && chosenCell.y === y) {
            setChosenCell(null)
        } else {
            if (
                possibleMagActions.some(
                    (action) => action.boardPosition.x === x && action.boardPosition.y === y,
                )
            ) {
                setChosenCell({ x, y })
            }
        }
    }

    const handleHandPieceClick = (handPieceIndex: number) => {
        if (chosenCell) {
            const action = possibleMagActions.find(
                (action) =>
                    action.handPieceIndex === handPieceIndex &&
                    action.boardPosition.x === chosenCell.x &&
                    action.boardPosition.y === chosenCell.y,
            )
            if (action) {
                onMagAction(action)
                setChosenCell(null)
            }
        }
    }

    return (
        <Wrapper className={className}>
            <BoardGrid
                boardWidth={magState.staticState.boardWidth}
                boardHeight={magState.staticState.boardHeight}
            >
                {magState.board.map((boardRow, y) =>
                    boardRow.map((piece, x) => (
                        <BoardCell
                            boardX={x}
                            boardY={y}
                            active={possibleMagActions.some(
                                (action) =>
                                    action.boardPosition.x === x && action.boardPosition.y === y,
                            )}
                            chosen={!!chosenCell && chosenCell.x === x && chosenCell.y === y}
                            onClick={() => handleBoardCellClicked(x, y)}
                        />
                    )),
                )}
            </BoardGrid>
            <HandContainer>
                {magState.avatars[magState.avatarTurnIndex].hand.map((handMagType, handIndex) => (
                    <HandPieceWrapper>
                        <Piece
                            active={
                                !!chosenCell &&
                                possibleMagActions.some(
                                    (action) => action.handPieceIndex === handIndex,
                                )
                            }
                            onClick={() => handleHandPieceClick(handIndex)}
                        />
                    </HandPieceWrapper>
                ))}
            </HandContainer>
        </Wrapper>
    )
}

export default MagnetronGame2d
