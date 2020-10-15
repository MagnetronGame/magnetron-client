import { AvatarPiece } from "../../../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import {
    MagnetType,
    Vec2I,
} from "../../../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { Anim } from "../../../animation_manager/animationTypes"
import * as THREE from "three"
import magnetAffectAnim from "./magnetAffectAnim"
import { Anims } from "../../../animation_manager/animationHelpers"

// private createNeighbourMagnetsEffect(avatar: AvatarPiece, boardPos: Vec2I): Anim {
//     const anims = this.getMagnetNeighbours(boardPos)
//         .filter(
//             ([piece, _]) =>
//                 piece.magnetType === MagnetType.POSITIVE ||
//                 piece.magnetType === MagnetType.NEGATIVE,
//         )
//         .map(([piece, bpos]) => {
//             const color = MagnetColorByType[piece.magnetType].lighter
//             const towardsAvatar = avatar.magnetType !== piece.magnetType
//             const aboveGroundVec = new THREE.Vector3(0, 0.05, 0)
//             return magnetAffectAnim(
//                 this.scene,
//                 this.board!.boardPosToWorldPos(boardPos).add(aboveGroundVec),
//                 this.board!.boardPosToWorldPos(bpos).add(aboveGroundVec),
//                 towardsAvatar,
//                 this.board!.staticBoard.cellSize.x,
//                 this.board!.staticBoard.cellSize.y,
//                 color,
//             )
//         })
//     return Anims.parallel(anims)
// }
