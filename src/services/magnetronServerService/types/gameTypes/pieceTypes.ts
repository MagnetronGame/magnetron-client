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

export type PieceType = Piece["type"]

export const isMagnetPiece = (piece: Piece): piece is MagnetPiece => piece.type === "MagnetPiece"
export const isAvatarPiece = (piece: Piece): piece is AvatarPiece => piece.type === "AvatarPiece"
export const isCoinPiece = (piece: Piece): piece is CoinPiece => piece.type === "CoinPiece"
export const isEmptyPiece = (piece: Piece): piece is EmptyPiece => piece.type === "EmptyPiece"
