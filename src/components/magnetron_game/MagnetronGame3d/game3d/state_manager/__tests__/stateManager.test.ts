import {
    MagnetType,
    Vec2I,
} from "../../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import {
    AvatarPiece,
    Piece,
} from "../../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { BoardState, calcStateDelta, PieceWithPos } from "../stateManager"
import { EMPTY_PIECE } from "../../../../../../services/magnetronServerService/gameHelpers"
import * as vec2i from "../../../../../../utils/vec2IUtils"

const emptyState: BoardState = {
    avatarPiecesWithPos: [],
    board: [
        [EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE],
        [EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE],
        [EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE],
        [EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE],
        [EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE, EMPTY_PIECE],
    ],
}

const setBoardPiece = (
    state: BoardState,
    piece_pieceWithPos: Piece | PieceWithPos,
    pos?: Vec2I,
): BoardState => {
    if (!pos) {
        const pieceWithPos = piece_pieceWithPos as PieceWithPos
        return setBoardPiece(state, pieceWithPos.piece, pieceWithPos.pos)
    } else {
        const piece = piece_pieceWithPos as Piece
        if (piece.type === "AvatarPiece") {
            return { ...state, avatarPiecesWithPos: [...state.avatarPiecesWithPos, { piece, pos }] }
        } else {
            return {
                ...state,
                board: state.board.map((boardRow, y) =>
                    boardRow.map((exPiece, x) => (vec2i.equals(pos, { x, y }) ? piece : exPiece)),
                ),
            }
        }
    }
}

const avatarPiece1: AvatarPiece = {
    id: "1",
    type: "AvatarPiece",
    index: 0,
    magnetType: MagnetType.POSITIVE,
}

const avatarPiece2: AvatarPiece = {
    id: "2",
    type: "AvatarPiece",
    index: 1,
    magnetType: MagnetType.NEGATIVE,
}

const stateWithOneAvatar: BoardState = setBoardPiece(emptyState, avatarPiece1, { x: 0, y: 0 })

test("null to empty state delta", () => {
    const nullToEmpty = calcStateDelta(null, emptyState)
    expect(nullToEmpty).toEqual({
        exitPieces: [],
        movedPieces: [],
        enterPieces: [],
        currentPieces: [],
    })
})

test("null to single avatar delta", () => {
    const initialState = null
    const nextState = stateWithOneAvatar
    const nullToSingleAvatar = calcStateDelta(initialState, nextState)
    expect(nullToSingleAvatar).toEqual({
        exitPieces: [],
        movedPieces: [],
        enterPieces: nextState.avatarPiecesWithPos,
        currentPieces: nextState.avatarPiecesWithPos,
    })
})

test("one to two avatars", () => {
    const avatarPiece1WithPos = {
        piece: avatarPiece1,
        pos: { x: 0, y: 0 },
    }
    const avatarPiece2WithPos = {
        piece: avatarPiece2,
        pos: { x: 1, y: 1 },
    }
    const initialState: BoardState = setBoardPiece(emptyState, avatarPiece1WithPos)
    const nextState: BoardState = setBoardPiece(initialState, avatarPiece2WithPos)

    const delta = calcStateDelta(initialState, nextState)
    expect(delta).toEqual({
        enterPieces: [avatarPiece2WithPos],
        exitPieces: [],
        movedPieces: [],
        currentPieces: [avatarPiece1WithPos, avatarPiece2WithPos],
    })
})

test("one to another avatar", () => {
    const avatarPiece1WithPos = {
        piece: avatarPiece1,
        pos: { x: 0, y: 0 },
    }
    const avatarPiece2WithPos = {
        piece: avatarPiece2,
        pos: { x: 1, y: 1 },
    }
    const stateWithAvatar1: BoardState = setBoardPiece(emptyState, avatarPiece1WithPos)
    const stateWithAvatar2: BoardState = setBoardPiece(emptyState, avatarPiece2WithPos)

    const delta = calcStateDelta(stateWithAvatar1, stateWithAvatar2)
    expect(delta).toEqual({
        enterPieces: [avatarPiece2WithPos],
        exitPieces: [avatarPiece1WithPos],
        movedPieces: [],
        currentPieces: [avatarPiece2WithPos],
    })
})

test("avatar move", () => {
    const avatarPieceWithPos1 = {
        piece: avatarPiece1,
        pos: { x: 0, y: 0 },
    }
    const avatarPieceWithPos2 = {
        piece: avatarPiece1,
        pos: { x: 1, y: 1 },
    }
    const stateWithPos1: BoardState = setBoardPiece(emptyState, avatarPieceWithPos1)
    const stateWithPos2: BoardState = setBoardPiece(emptyState, avatarPieceWithPos2)

    const delta = calcStateDelta(stateWithPos1, stateWithPos2)
    expect(delta).toEqual({
        enterPieces: [],
        exitPieces: [],
        movedPieces: [{ ...avatarPieceWithPos2, prevPos: avatarPieceWithPos1.pos }],
        currentPieces: [avatarPieceWithPos2],
    })
})
