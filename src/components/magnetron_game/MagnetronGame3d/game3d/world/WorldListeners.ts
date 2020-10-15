import {
    AvatarPiece,
    isAvatarPiece,
} from "../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { Vec2I } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import World from "./World"

export type AvatarsDisplayPositionChangeListener = (
    avatar: AvatarPiece,
    displayPosition: Vec2I,
) => void

export default class WorldListeners {
    private world: World

    constructor(world: World) {
        this.world = world
    }

    public onAvatarDisplayPositionChange(listener: AvatarsDisplayPositionChangeListener) {
        this.world.visBoard.onVisPieceChange = (type, visPiece) => {
            if (isAvatarPiece(visPiece.pieceData)) {
                const avatar = visPiece.pieceData
                const avatarIndex = avatar.ownerAvatarIndex
                const screenPosition = this.world.transforms.getAvatarsScreenPosition()[avatarIndex]
                listener(avatar, screenPosition)
            }
        }
    }
}
