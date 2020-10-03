import React, { useEffect, useState } from "react"
import * as vec2i from "../../../utils/vec2IUtils"
import {
    BoardCell,
    BoardGrid,
    CellPieceWrapper,
    HandContainer,
    HandPieceWrapper,
    StyledPieceComp,
    Wrapper,
} from "./elements"
import {
    MagState,
    Vec2I,
} from "../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { MagAction } from "../../../services/magnetronServerService/types/gameTypes/actionTypes"
import { Piece } from "../../../services/magnetronServerService/types/gameTypes/pieceTypes"

type Props = {
    className?: string
    playerIndex: number
    magState: MagState
    possibleMagActions: MagAction[]
    onMagAction: (action: MagAction) => void
    disabled?: boolean
}

const MagnetronGame2d: React.FC<Props> = ({
    className,
    playerIndex,
    magState,
    possibleMagActions,
    onMagAction,
    disabled,
}) => {
    const [chosenCell, setChosenCell] = useState<Vec2I | null>(null)

    const boardWithAvatars = magState.board.map((boardRow, y) =>
        boardRow.map((boardPiece, x) => {
            const avatar = magState.avatars.find((a) => vec2i.equals(a.position, { x, y }))
            return avatar?.piece || boardPiece
        }),
    )

    const hand = magState.avatars[playerIndex].avatarData.hand
    const handPieceWidthRatio = 1 / 3 // start hand should be included in static state

    useEffect(() => {
        if (disabled) {
            setChosenCell(null)
        }
    }, [disabled])

    const handleBoardCellClicked = (boardPos: Vec2I) => {
        if (!disabled) {
            if (chosenCell && vec2i.equals(chosenCell, boardPos)) {
                setChosenCell(null)
            } else {
                if (possibleMagActions.map((a) => a.boardPosition).some(vec2i.equalTo(boardPos))) {
                    setChosenCell(boardPos)
                }
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
                {hand.map((handPiece, handIndex) => (
                    <HandPieceWrapper
                        key={handPiece.id}
                        handPieceWidthRatio={handPieceWidthRatio}
                        onClick={() => handleHandPieceClick(handIndex)}
                    >
                        <StyledPieceComp
                            piece={handPiece}
                            active={
                                !!chosenCell &&
                                possibleMagActions.some(
                                    (action) => action.handPieceIndex === handIndex,
                                )
                            }
                        />
                    </HandPieceWrapper>
                ))}
            </HandContainer>
        </Wrapper>
    )
}

export default MagnetronGame2d
