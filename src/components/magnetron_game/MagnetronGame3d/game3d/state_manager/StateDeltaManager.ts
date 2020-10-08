import {
    MagBoard,
    MagState,
    Vec2I,
} from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import {
    AvatarPiece,
    Piece,
} from "../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import * as vec2i from "../../../../../utils/vec2IUtils"
import { Maps } from "../../../../../utils/Maps"

export type PieceWithPos<T = Piece> = {
    piece: T
    pos: Vec2I
}

export type BoardState = {
    avatarPiecesWithPos: PieceWithPos<AvatarPiece>[]
    board: MagBoard
}

export type PieceWithChangedPos = PieceWithPos & {
    prevPos: Vec2I
}

export type StateDelta = {
    enterPieces: PieceWithPos[]
    exitPieces: PieceWithPos[]
    movedPieces: PieceWithChangedPos[]
    currentPieces: PieceWithPos[]
}

export const allPiecesWithPosById = (state: BoardState): Map<string, PieceWithPos> => {
    const avatarPiecesWithPos = state.avatarPiecesWithPos.map<[string, PieceWithPos]>((a) => [
        a.piece.id,
        { piece: a.piece, pos: a.pos },
    ])
    const boardPiecesWithPos = state.board.flatMap((boardRow, y) =>
        boardRow
            .filter((p) => p.type !== "EmptyPiece")
            .map<[string, PieceWithPos]>((p, x) => [p.id, { piece: p, pos: { x, y } }]),
    )
    return new Map([...avatarPiecesWithPos, ...boardPiecesWithPos])
}

export const calcStateDelta = (prevState: BoardState | null, newState: BoardState): StateDelta => {
    if (!prevState) {
        const allPiecesWithPos = [...allPiecesWithPosById(newState).values()]
        return {
            enterPieces: allPiecesWithPos,
            exitPieces: [],
            movedPieces: [],
            currentPieces: allPiecesWithPos,
        }
    } else {
        const prevPiecesWithPosById = allPiecesWithPosById(prevState)
        const newPiecesWithPosById = allPiecesWithPosById(newState)

        const persistedPieceIds = [
            ...Maps.intersection(prevPiecesWithPosById, newPiecesWithPosById).keys(),
        ]
        const movedPieces: PieceWithChangedPos[] = persistedPieceIds
            .map((id) => {
                const newPieceWithPos = newPiecesWithPosById.get(id)!
                const prevPos = prevPiecesWithPosById.get(id)!.pos
                const newPos = newPieceWithPos.pos
                return { piece: newPieceWithPos.piece, pos: newPos, prevPos }
            })
            .filter(({ pos, prevPos }) => !vec2i.equals(pos, prevPos))
        const currentPieces = [...newPiecesWithPosById.values()]
        const enterPieces = [...Maps.diff(newPiecesWithPosById, prevPiecesWithPosById).values()]
        const exitPieces = [...Maps.diff(prevPiecesWithPosById, newPiecesWithPosById).values()]

        return {
            enterPieces,
            exitPieces,
            movedPieces,
            currentPieces,
        }
    }
}

const magStateToBoardState = (state: MagState): BoardState => ({
    avatarPiecesWithPos: state.avatars.map((a) => ({ piece: a.piece, pos: a.position })),
    board: state.board,
})

export class StateDeltaManager {
    prevState: MagState | null = null

    public stateDelta(state: MagState): StateDelta {
        const prevBoardState = this.prevState && magStateToBoardState(this.prevState)
        const newBoardState = magStateToBoardState(state)
        const stateDelta = calcStateDelta(prevBoardState, newBoardState)
        this.prevState = state
        return stateDelta
    }
}
