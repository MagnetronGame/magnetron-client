import * as vec2i from "../../../../../../../utils/vec2IUtils"
import { Maps } from "../../../../../../utils/Maps"
import { BoardState } from "../stateTypes"
import { ChangedPieceWithPos, PieceWithChangedPos, StateDelta } from "./stateDeltaTypes"
import { allPiecesWithPosById, findChangedProperties } from "./stateDeltaHelpers"
import { zip } from "../../../../../../utils/arrayUtils"

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

export const calcStateDeltasBetween = (boardStates: (BoardState | null)[]): StateDelta[] => {
    const simStateDeltas = zip(
        boardStates.slice(0, -1),
        boardStates.slice(1),
    ).map(([prevBState, nextBState]) => calcStateDelta(prevBState, nextBState!))
    return simStateDeltas
}
