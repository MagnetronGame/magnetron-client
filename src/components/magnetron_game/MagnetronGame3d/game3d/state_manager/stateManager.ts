import {
    MagState,
    Vec2I,
} from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { Piece } from "../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import * as vec2i from "../../../../../utils/vec2IUtils"
import { Maps } from "../../../../../utils/Maps"

export type PieceWithPos = {
    piece: Piece
    pos: Vec2I
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

const allPiecesWithPosById = (state: MagState): Map<string, PieceWithPos> => {
    const avatarPiecesWithPos = state.avatars.map<[string, PieceWithPos]>((a) => [
        a.piece.id,
        { piece: a.piece, pos: a.position },
    ])
    const boardPiecesWithPos = state.board.flatMap((boardRow, y) =>
        boardRow.map<[string, PieceWithPos]>((p, x) => {
            const pos = { x, y }
            const id = p.type === "EmptyPiece" ? `${x}-${y}` : p.id
            return [id, { piece: p, pos }]
        }),
    )
    return new Map([...avatarPiecesWithPos, ...boardPiecesWithPos])
}

const calcStateDelta = (prevState: MagState | null, newState: MagState): StateDelta => {
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

export class StateManager {
    prevState: MagState | null = null

    public stateDelta(state: MagState): StateDelta {
        const stateDelta = calcStateDelta(this.prevState, state)
        this.prevState = state
        return stateDelta
    }
}
