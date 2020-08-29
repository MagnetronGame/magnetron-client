import * as THREE from "three"
import { Animation } from "./animation"
import { Magnetron } from "./magnetron"

export class ShakeAnimation extends Animation {
    private readonly initialObject3d: THREE.Object3D
    private readonly shakeStrength: number
    private readonly shakeFrequency: number

    private object3d: THREE.Object3D

    public constructor(
        object3d: THREE.Object3D,
        duration: number = 1,
        shakeStrength: number = 0.05,
        shakeFrequency: number = 0.08,
    ) {
        super(duration, false)
        this.initialObject3d = object3d.clone(true)
        this.shakeStrength = shakeStrength
        this.shakeFrequency = shakeFrequency

        this.object3d = object3d
    }

    public update = (game: Magnetron, deltaTime: number) => {
        const decayFactor = 1 - this.currDuration / this.duration
        const currShakeStrength = this.shakeStrength * decayFactor
        this.object3d.position.y =
            this.initialObject3d.position.y +
            Math.sin((this.currDuration / this.shakeFrequency) * Math.PI * 2) * currShakeStrength
    }

    protected end(game: Magnetron): void {
        this.object3d.copy(this.initialObject3d, true)
    }

    protected start(game: Magnetron): void {}
}
