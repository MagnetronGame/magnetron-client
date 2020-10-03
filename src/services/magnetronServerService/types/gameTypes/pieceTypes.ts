import { MagnetType } from "./stateTypes"

export type AvatarPiece = {
    type: "AvatarPiece"
    id: string
    index: number
    magnetType: MagnetType
}

export type CoinPiece = {
    type: "CoinPiece"
    id: string
    value: number
}

export type MagnetPiece = {
    type: "MagnetPiece"
    id: string
    magnetType: MagnetType
}

export type EmptyPiece = {
    type: "EmptyPiece"
    id: string
}

export type Piece = AvatarPiece | CoinPiece | MagnetPiece | EmptyPiece
export type PieceType = Piece["type"]
