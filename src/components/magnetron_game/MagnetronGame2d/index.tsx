import React, { useEffect, useState } from "react"
import {
    MagAction,
    MagnetPiece,
    MagState,
    Piece,
    Vec2I,
} from "../../../services/magnetronServerService/magnetronGameTypes"
import * as vec2i from "../../../utils/vec2IUtils"
import {
    BoardCell,
    BoardGrid,
    CellPieceWrapper,
    HandContainer,
    HandPieceWrapper,
    Overlay,
    OverlayText,
    StyledPieceComp,
    Wrapper,
} from "./elements"

type Props = {
    className?: string
    playerIndex: number
    magState: MagState
    possibleMagActions: MagAction[]
    onMagAction: (action: MagAction) => void
}

const MagnetronGame2d: React.FC<Props> = ({
    className,
    playerIndex,
    magState,
    possibleMagActions,
    onMagAction,
}) => {
    const [chosenCell, setChosenCell] = useState<Vec2I | null>(null)

    const boardWithAvatars = magState.board.map((boardRow, y) =>
        boardRow.map((boardPiece, x) => {
            const avatarIndex = magState.avatarsBoardPosition.findIndex((avatarBoardPos) =>
                vec2i.equals(avatarBoardPos, { x, y }),
            )
            return avatarIndex !== -1 ? magState.avatars[avatarIndex] : boardPiece
        }),
    )

    const hand = magState.avatars[playerIndex].hand

    const myTurn = magState.avatarTurnIndex === playerIndex

    useEffect(() => {
        if (!myTurn) {
            setChosenCell(null)
        }
    }, [myTurn])

    const handleBoardCellClicked = (boardPos: Vec2I) => {
        if (myTurn) {
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
            {!myTurn && (
                <Overlay>
                    <OverlayText>Player {magState.avatarTurnIndex}'s turn</OverlayText>
                </Overlay>
            )}
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
                {hand.map((handMagType, handIndex) => {
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
