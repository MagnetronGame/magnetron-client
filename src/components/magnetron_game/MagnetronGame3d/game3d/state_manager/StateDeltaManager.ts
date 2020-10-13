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
import { Sets } from "../../../../../utils/Sets"

export type PieceWithPos<T = Piece> = {
    piece: T
    pos: Vec2I
}

type ChangedPropertiesOldValues<T extends Piece> = { [K in keyof T]: T[K] | null }

export type ChangedPieceWithPos<T extends Piece = Piece> = {
    piece: T
    pos: Vec2I
    changedProperties: ChangedPropertiesOldValues<T>
}

export type BoardState = {
    avatarPiecesWithPos: PieceWithPos<AvatarPiece>[]
    board: MagBoard
}

export type PieceWithChangedPos<T = Piece> = PieceWithPos<T> & {
    prevPos: Vec2I
}

export type StateDelta = {
    enterPieces: PieceWithPos[]
    exitPieces: PieceWithPos[]
    movedPieces: PieceWithChangedPos[]
    changedPieces: ChangedPieceWithPos[]
    currentPieces: PieceWithPos[]
}

export const allPiecesWithPosById = (state: BoardState): Map<string, PieceWithPos> => {
    const avatarPiecesWithPos = state.avatarPiecesWithPos.map<[string, PieceWithPos]>((a) => [
        a.piece.id,
        { piece: a.piece, pos: a.pos },
    ])
    const boardPiecesWithPos = state.board.flatMap((boardRow, y) =>
        boardRow
            .map<[string, PieceWithPos]>((p, x) => [p.id, { piece: p, pos: { x, y } }])
            .filter(([_, p]) => p.piece.type !== "EmptyPiece"),
    )
    return new Map([...avatarPiecesWithPos, ...boardPiecesWithPos])
}

const findChangedProperties = <T extends Piece>(
    oldPiece: T,
    newPiece: T,
): ChangedPropertiesOldValues<T> | null => {
    // performs a shallow comparison of the pieces properties
    type PieceKey = keyof T
    const oldKeys = new Set(Object.keys(oldPiece) as PieceKey[])
    const newKeys = new Set(Object.keys(newPiece) as PieceKey[])
    const enterKeys = Sets.diff(newKeys, oldKeys)
    const persistentKeys = Sets.intersection(newKeys, oldKeys)

    const persistentChangedProperties: { [k in PieceKey]: T[k] } = Object.fromEntries(
        [...persistentKeys]
            .map<[PieceKey, T[PieceKey], T[PieceKey]]>((key) => [key, oldPiece[key], newPiece[key]])
            .filter(([_, oldVal, newVal]) => oldVal !== newVal)
            .map<[PieceKey, T[PieceKey]]>(([key, oldVal]) => [key, oldVal]),
    ) as any
    const enteredChangedProperties: { [k in PieceKey]: null } = Object.fromEntries(
        [...enterKeys].map<[PieceKey, null]>((k) => [k, null]),
    ) as any
    const changedProperties: ChangedPropertiesOldValues<T> = {
        ...enteredChangedProperties,
        ...persistentChangedProperties,
    }

    return Object.keys(changedProperties).length === 0 ? null : changedProperties
}

export const calcStateDelta = (prevState: BoardState | null, newState: BoardState): StateDelta => {
    if (!prevState) {
        const allPiecesWithPos = [...allPiecesWithPosById(newState).values()]
        return {
            enterPieces: allPiecesWithPos,
            exitPieces: [],
            movedPieces: [],
            changedPieces: [],
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

        const changedPieces: ChangedPieceWithPos[] = persistedPieceIds
            .map((id) => {
                const newPieceWithPos = newPiecesWithPosById.get(id)!
                const prevPieceWithPos = prevPiecesWithPosById.get(id)!
                const changedProperties = findChangedProperties(
                    prevPieceWithPos.piece,
                    newPieceWithPos.piece,
                )
                const changedPiece: ChangedPieceWithPos | null = changedProperties
                    ? { piece: newPieceWithPos.piece, pos: newPieceWithPos.pos, changedProperties }
                    : null
                return changedPiece
            })
            .filter((changedPiece) => changedPiece !== null) as ChangedPieceWithPos[]

        const currentPieces = [...newPiecesWithPosById.values()]
        const enterPieces = [...Maps.diff(newPiecesWithPosById, prevPiecesWithPosById).values()]
        const exitPieces = [...Maps.diff(prevPiecesWithPosById, newPiecesWithPosById).values()]

        return {
            enterPieces,
            exitPieces,
            movedPieces,
            changedPieces,
            currentPieces,
        }
    }
}

export const magStateToBoardState = (state: MagState): BoardState => ({
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
