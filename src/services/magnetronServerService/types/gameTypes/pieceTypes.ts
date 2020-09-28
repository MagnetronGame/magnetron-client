import { MagnetType } from "./stateTypes"

export type Piece = {
    type: string
    id: string
}

export interface AvatarPiece extends Piece {
    index: number
    magnetType: MagnetType
}

export interface CoinPiece extends Piece {
    value: number
}

export interface MagnetPiece extends Piece {
    magnetType: MagnetType
}

export interface EmptyPiece extends Piece {}
