import { Vec2I } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { getSortedAvatarsWorldPos } from "./board/visBoardHelpers"
import World from "./World"
import * as THREE from "three"

export default class WorldTransforms {
    private world: World

    constructor(world: World) {
        this.world = world
    }

    public worldToScreenPos(position: THREE.Vector3): Vec2I {
        // obj.updateMatrixWorld()
        const _position = position.clone()
        _position.project(this.world.camera)
        const width = this.world.renderer.domElement.width
        const height = this.world.renderer.domElement.height
        return {
            x: ((_position.x + 1) * width) / 2,
            y: (-(_position.y - 1) * height) / 2,
        }
    }

    public getAvatarsScreenPosition(): Vec2I[] {
        return getSortedAvatarsWorldPos(this.world.visBoard).map((worldPos) =>
            this.worldToScreenPos(worldPos),
        )
    }
}
