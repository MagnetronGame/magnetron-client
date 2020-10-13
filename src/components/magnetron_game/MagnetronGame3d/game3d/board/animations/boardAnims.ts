import { Piece } from "../../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { Vec2I } from "../../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { Anim, SingleAnim } from "../../animation/animationTypes"
import { createVisPiece } from "../visualObjects/visPieces"
import * as vec2i from "*"
import { Board } from "../board"

// export function addPiece(board: Board, piece: Piece, boardPos: Vec2I): Anim {
//     const visPiece = createVisPiece(piece, board.staticBoard)
//     board.attachVisPiece(visPiece, boardPos)
//     const anim: SingleAnim = {
//         name: `Add piece at ${vec2i.toString(boardPos)}: ${visPiece.pieceData.type}`,
//         duration: 0,
//         start: () => {
//             board.addVisPieceGraphics(visPiece, boardPos)
//         },
//     }
//     return anim
// }
//
// export function removePiece(board: Board, pieceId: string, boardPos: Vec2I): SingleAnim | null {
//     const visPiece = board.getVisPiece(boardPos, pieceId)
//     if (visPiece) {
//         board.detachVisPiece(visPiece, boardPos)
//
//         const anim: SingleAnim = {
//             name: `Remove piece at ${vec2i.toString(boardPos)}: ${visPiece.pieceData.type}`,
//             duration: 0,
//             start: () => {
//                 board.removeVisPieceGraphics(visPiece)
//             },
//         }
//         return anim
//     } else {
//         return null
//     }
// }
//
// export function movePiece(
//     board: Board,
//     pieceId: string,
//     fromBoardPos: Vec2I,
//     toBoardPos: Vec2I,
// ): SingleAnim | null {
//     const visPiece = board.getVisPiece(fromBoardPos, pieceId)
//     if (visPiece) {
//         board.retatchVisPiece(visPiece, fromBoardPos, toBoardPos)
//
//         const fromPos = board.boardPosToWorldPos(fromBoardPos)
//         const toPos = board.boardPosToWorldPos(toBoardPos)
//         const moveAnim: SingleAnim = {
//             name: `Move piece ${visPiece.pieceData.type} from ${vec2i.toString(
//                 fromBoardPos,
//             )} to ${vec2i.toString(toBoardPos)}`,
//             duration: 1,
//             update: ({ currDuration, duration }) => {
//                 const durationRatio = currDuration / duration
//                 const intermediatePos = fromPos
//                     .clone()
//                     .multiplyScalar(1 - durationRatio)
//                     .add(toPos.clone().multiplyScalar(durationRatio))
//                 board.changeVisPiecePosition(visPiece, intermediatePos)
//             },
//             end: () => {
//                 board.changeVisPiecePosition(visPiece, toPos)
//             },
//         }
//
//         return moveAnim
//     } else {
//         return null
//     }
// }
