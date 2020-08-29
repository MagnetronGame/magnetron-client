import { Animation } from "./animation"
import { Magnetron } from "./magnetron"
import * as THREE from "three"

export class CameraZoomRotate extends Animation {
    private startDistance: number
    private endDistance: number
    private startAngle: number
    private endHeight: number

    constructor(
        startDistance: number,
        endDistance: number,
        startAngle: number,
        endHeight: number,
        duration: number,
    ) {
        super(duration)
        this.startDistance = startDistance
        this.endDistance = endDistance
        this.startAngle = startAngle
        this.endHeight = endHeight
    }

    private setCameraOffset(camera: THREE.Camera, distance: number, angle: number) {
        const upVec = new THREE.Vector3(0, 1, 1)
        const startOffset = new THREE.Vector3(0, this.endHeight, distance).applyAxisAngle(
            upVec,
            angle,
        )

        camera.position.copy(startOffset)

        camera.lookAt(0, 0, 0)
    }

    start(game: Magnetron): void {
        this.setCameraOffset(game.camera, this.startDistance, this.startAngle)
    }

    update(game: Magnetron, deltaTime: number): void {
        const durationFactor = this.currDuration / this.duration
        const currDistance =
            this.startDistance * (1 - durationFactor) + this.endDistance * durationFactor
        const currAngle = this.startAngle * (1 - durationFactor)
        this.setCameraOffset(game.camera, currDistance, currAngle)
    }

    end(game: Magnetron): void {
        this.setCameraOffset(game.camera, this.endDistance, 0)
        console.log("Zoom rotate ended")
    }
}
