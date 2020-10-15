import { AvatarPiece } from "../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { MagBoard } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { PieceWithPos } from "./state_delta/stateDeltaTypes"

export type BoardState = {
    avatarPiecesWithPos: PieceWithPos<AvatarPiece>[]
    board: MagBoard
}
