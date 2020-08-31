import { Animation } from "./animation"
import { Magnetron } from "./magnetron"

export class CameraMovement extends Animation {
    constructor() {
        super(-1, true)
    }

    start(game: Magnetron): void {
        game.camera.position.z = 0.6
        game.camera.position.y = 1
        game.camera.position.x = 0

        game.camera.lookAt(0, 0, 0)
    }

    update(game: Magnetron, deltaTime: number): void {
        game.camera.position.x = -Math.sin(this.currDuration) * 0.01
        game.camera.lookAt(0, 0, 0)
    }

    end(game: Magnetron): void {}
}
