import { Piece } from "../../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { Vec2I } from "../../../../../../services/magnetronServerService/types/gameTypes/stateTypes"

export type PieceWithPos<T = Piece> = {
    piece: T
    pos: Vec2I
}

export type ChangedPropertiesOldValues<T extends Piece> = { [K in keyof T]: T[K] | null }

export type ChangedPieceWithPos<T extends Piece = Piece> = {
    piece: T
    pos: Vec2I
    changedProperties: ChangedPropertiesOldValues<T>
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
