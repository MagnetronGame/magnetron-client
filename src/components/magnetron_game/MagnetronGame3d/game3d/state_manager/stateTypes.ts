import { AvatarPiece } from "../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { MagBoard } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { PieceWithPos } from "./state_delta/stateDelta"

export type BoardState = {
    avatarPiecesWithPos: PieceWithPos<AvatarPiece>[]
    board: MagBoard
}
