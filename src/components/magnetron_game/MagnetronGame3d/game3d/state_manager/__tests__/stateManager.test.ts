import {
    MagnetType,
    Vec2I,
} from "../../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import {
    AvatarPiece,
    MagnetPiece,
    Piece,
} from "../../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { EMPTY_PIECE } from "../../../../../../services/magnetronServerService/gameHelpers"
import * as vec2i from "../../../../../../utils/vec2IUtils"
import { BoardState, calcStateDelta, PieceWithPos } from "../StateDeltaManager"

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
    ownerAvatarIndex: 0,
    magnetType: MagnetType.POSITIVE,
}

const avatarPiece2: AvatarPiece = {
    id: "2",
    type: "AvatarPiece",
    ownerAvatarIndex: 1,
    magnetType: MagnetType.NEGATIVE,
}

const stateWithOneAvatar: BoardState = setBoardPiece(emptyState, avatarPiece1, { x: 0, y: 0 })

test("null to empty state delta", () => {
    const nullToEmpty = calcStateDelta(null, emptyState)
    expect(nullToEmpty).toEqual({
        exitPieces: [],
        movedPieces: [],
        enterPieces: [],
        changedPieces: [],
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
        changedPieces: [],
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
        changedPieces: [],
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
        changedPieces: [],
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
        changedPieces: [],
        currentPieces: [avatarPieceWithPos2],
    })
})

test("change magnet piece type", () => {
    const magnetPiece1: MagnetPiece = {
        type: "MagnetPiece",
        id: "1",
        magnetType: MagnetType.POSITIVE,
        ownerAvatarIndex: 0,
    }
    const magnetPiece2 = { ...magnetPiece1, magnetType: MagnetType.NEGATIVE }
    const pos = { x: 1, y: 1 }
    const state1: BoardState = setBoardPiece(emptyState, magnetPiece1, pos)
    const state2: BoardState = setBoardPiece(emptyState, magnetPiece2, pos)

    const delta = calcStateDelta(state1, state2)
    expect(delta).toEqual({
        enterPieces: [],
        exitPieces: [],
        movedPieces: [],
        changedPieces: [
            {
                piece: magnetPiece2,
                pos,
                changedProperties: { magnetType: magnetPiece1.magnetType },
            },
        ],
        currentPieces: [{ piece: magnetPiece2, pos }],
    })
})

test("move and change magnet piece type", () => {
    const magnetPiece1WithPos: PieceWithPos<MagnetPiece> = {
        piece: {
            type: "MagnetPiece",
            id: "1",
            magnetType: MagnetType.UNKNOWN,
            ownerAvatarIndex: 0,
        },
        pos: { x: 1, y: 1 },
    }
    const magnetPiece2WithPos: PieceWithPos<MagnetPiece> = {
        piece: { ...magnetPiece1WithPos.piece, magnetType: MagnetType.POSITIVE },
        pos: { x: 2, y: 2 },
    }
    const state1: BoardState = setBoardPiece(emptyState, magnetPiece1WithPos)
    const state2: BoardState = setBoardPiece(emptyState, magnetPiece2WithPos)

    const delta = calcStateDelta(state1, state2)
    expect(delta).toEqual({
        enterPieces: [],
        exitPieces: [],
        movedPieces: [{ ...magnetPiece2WithPos, prevPos: magnetPiece1WithPos.pos }],
        changedPieces: [
            {
                ...magnetPiece2WithPos,
                changedProperties: { magnetType: MagnetType.UNKNOWN },
            },
        ],
        currentPieces: [magnetPiece2WithPos],
    })
})
