import { Piece } from "../../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { Sets } from "../../../../../../utils/Sets"
import { BoardState } from "../stateTypes"
import { ChangedPropertiesOldValues, PieceWithPos } from "./stateDeltaTypes"

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

export const findChangedProperties = <T extends Piece>(
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
