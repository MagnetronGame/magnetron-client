import { Vec2I } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { MagnetPiece } from "../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import * as vec2i from "../../../../../utils/vec2IUtils"
import { BoardState } from "./stateTypes"

// export function getMagnetNeighbours(
//     boardState: BoardState,
//     boardPos: Vec2I,
// ): [MagnetPiece, Vec2I][] {
//     const neighbourPositions = [
//         { x: -1, y: 0 },
//         { x: 0, y: -1 },
//         { x: 1, y: 0 },
//         { x: 0, y: 1 },
//     ]
//         .map((relNPos) => vec2i.add(boardPos, relNPos))
//         .filter((bPos) => this.board!.isPositionInsideBoard(bPos))
//     const nMagnetsWithPos = neighbourPositions
//         .map((bpos) => [this.board!.getPieceOfType(bpos, "MagnetPiece"), bpos])
//         .filter(([magnet, _]) => !!magnet) as [MagnetPiece, Vec2I][]
//
//     return nMagnetsWithPos
// }
