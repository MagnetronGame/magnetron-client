import React, { useEffect, useState } from "react"
import {
    MagAction,
    MagnetPiece,
    MagState,
    Piece,
    Vec2I,
} from "../../../services/magnetronServerService/magnetronGameTypes"
import styled from "styled-components"
import { PieceComp } from "./pieces"
import * as vec2i from "../../../utils/vec2IUtils"

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
    width: auto;
    display: grid;
    grid-template-columns: repeat(${(props) => props.boardWidth}, minmax(0, 1fr));
    grid-template-rows: repeat(${(props) => props.boardHeight}, minmax(0, 1fr));
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

const CellPieceWrapper = styled.div`
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: center;
`

const HandContainer = styled.div`
    height: 20%;
    border: 3px solid #10588d;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
`

const HandPieceWrapper = styled.div`
    box-sizing: border-box;
    height: 100%;
    width: auto;
    padding: 10px;
    display: flex;
    justify-content: center;
`

const StyledPieceComp = styled(PieceComp)<{ active?: boolean }>`
    box-sizing: border-box;
    height: 100%;
    width: auto;
    //background-color: aquamarine;
    ${(props) => props.active && `box-shadow: 0px 0px 20px 3px ${CHOSEN_CELL_COLOR}`};
    //border: 1px solid black;
`

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

    const handleBoardCellClicked = (boardPos: Vec2I) => {
        if (chosenCell && vec2i.equals(chosenCell, boardPos)) {
            setChosenCell(null)
        } else {
            if (possibleMagActions.map((a) => a.boardPosition).some(vec2i.equalTo(boardPos))) {
                setChosenCell(boardPos)
            }
        }
    }

    const handleHandPieceClick = (handPieceIndex: number) => {
        if (chosenCell) {
            const action = possibleMagActions.find(
                (action) =>
                    action.handPieceIndex === handPieceIndex &&
                    vec2i.equals(action.boardPosition, chosenCell),
            )
            if (action) {
                onMagAction(action)
                setChosenCell(null)
            }
        }
    }

    const boardWithAvatars = magState.board.map((boardRow, y) =>
        boardRow.map((boardPiece, x) => {
            const avatarIndex = magState.avatarsBoardPosition.findIndex((avatarBoardPos) =>
                vec2i.equals(avatarBoardPos, { x, y }),
            )
            return avatarIndex !== -1 ? magState.avatars[avatarIndex] : boardPiece
        }),
    )

    return (
        <Wrapper className={className}>
            <BoardGrid
                boardWidth={magState.staticState.boardWidth}
                boardHeight={magState.staticState.boardHeight}
            >
                {boardWithAvatars.map((boardRow, y) =>
                    boardRow
                        .map<[Piece, Vec2I]>((piece, x) => [piece, { x, y }])
                        .map(([piece, boardPos]) => (
                            <BoardCell
                                key={vec2i.toString(boardPos) + JSON.stringify(piece)}
                                boardX={boardPos.x}
                                boardY={boardPos.y}
                                active={possibleMagActions.some((action) =>
                                    vec2i.equals(action.boardPosition, boardPos),
                                )}
                                chosen={!!chosenCell && vec2i.equals(chosenCell, boardPos)}
                                onClick={() => handleBoardCellClicked(boardPos)}
                            >
                                <CellPieceWrapper>
                                    <StyledPieceComp piece={piece} />
                                </CellPieceWrapper>
                            </BoardCell>
                        )),
                )}
            </BoardGrid>
            <HandContainer>
                {magState.avatars[magState.avatarTurnIndex].hand.map((handMagType, handIndex) => {
                    const handMagnetPiece = { type: "MagnetPiece", magnetType: handMagType }
                    return (
                        <HandPieceWrapper
                            key={handIndex + JSON.stringify(handMagnetPiece)}
                            onClick={() => handleHandPieceClick(handIndex)}
                        >
                            <StyledPieceComp
                                piece={handMagnetPiece}
                                active={
                                    !!chosenCell &&
                                    possibleMagActions.some(
                                        (action) => action.handPieceIndex === handIndex,
                                    )
                                }
                            />
                        </HandPieceWrapper>
                    )
                })}
            </HandContainer>
        </Wrapper>
    )
}

export default MagnetronGame2d
