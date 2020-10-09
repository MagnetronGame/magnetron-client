import { MagnetType } from "./stateTypes"

export type AvatarPiece = {
    type: "AvatarPiece"
    id: string
    ownerAvatarIndex: number
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
    ownerAvatarIndex: number
}

export type EmptyPiece = {
    type: "EmptyPiece"
    id: string
}

export type Piece = AvatarPiece | CoinPiece | MagnetPiece | EmptyPiece
