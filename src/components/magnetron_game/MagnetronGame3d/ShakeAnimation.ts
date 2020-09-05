import * as THREE from "three"
import { AnimUpdateProps, SingleAnim } from "./animation/animationTypes"

export default class ShakeAnimation implements SingleAnim {
    duration: number
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
        this.duration = duration
        this.initialObject3d = object3d.clone(true)
        this.shakeStrength = shakeStrength
        this.shakeFrequency = shakeFrequency

        this.object3d = object3d
    }

    update({ currDuration, durationRatioInv }: AnimUpdateProps) {
        const decayFactor = durationRatioInv
        const currShakeStrength = this.shakeStrength * decayFactor
        this.object3d.position.y =
            this.initialObject3d.position.y +
            Math.sin((currDuration / this.shakeFrequency) * Math.PI * 2) * currShakeStrength
    }

    end() {
        this.object3d.copy(this.initialObject3d, true)
    }
}
