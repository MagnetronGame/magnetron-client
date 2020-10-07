import * as THREE from "three"
import { Anim } from "./animation/animationTypes"
import { Duration } from "./animation/animationHelpers"

export default (camera: THREE.Camera): Anim => ({
    name: "Camera movement",
    duration: Duration.INF,
    context: "main-parallel",
    start: () => {
        camera.position.z = 0.6
        camera.position.y = 1
        camera.position.x = 0

        camera.lookAt(0, 0, 0)
    },
    update: ({ currDuration }) => {
        camera.position.x = -Math.sin(currDuration) * 0.01
        camera.lookAt(0, 0, 0)
    },
})

// export class CameraMovementAnim extends Animation {
//     constructor() {
//         super(-1, true)
//     }
//
//     start(game: Magnetron): void {
//         game.camera.position.z = 0.6
//         game.camera.position.y = 1
//         game.camera.position.x = 0
//
//         game.camera.lookAt(0, 0, 0)
//     }
//
//     update(game: Magnetron, deltaTime: number): void {
//         game.camera.position.x = -Math.sin(this.currDuration) * 0.01
//         game.camera.lookAt(0, 0, 0)
//     }
//
//     end(game: Magnetron): void {}
// }
