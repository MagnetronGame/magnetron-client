import { Piece } from "./pieceTypes"

export type MagStaticState = {
    magnetronVersion: string
    avatarCount: number
    boardWidth: number
    boardHeight: number
    avatarsStartingHand: Piece[][]
    roundCountBeforeSimulation: number
}
