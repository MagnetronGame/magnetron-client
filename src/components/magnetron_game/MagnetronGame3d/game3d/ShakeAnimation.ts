import * as THREE from "three"
import { AnimUpdateProps, SingleAnim } from "./animation/animationTypes"

export default class ShakeAnimation implements SingleAnim {
    duration: number
    private readonly initialObjectPos: THREE.Vector3
    private readonly shakeStrength: number
    private readonly shakeFrequency: number

    private object: THREE.Object3D

    public constructor(
        object: THREE.Object3D,
        duration: number = 1,
        shakeStrength: number = 0.05,
        shakeFrequency: number = 0.08,
    ) {
        this.duration = duration
        this.initialObjectPos = object.position.clone()
        this.shakeStrength = shakeStrength
        this.shakeFrequency = shakeFrequency

        this.object = object
    }

    update({ currDuration, durationRatioInv }: AnimUpdateProps) {
        const decayFactor = durationRatioInv
        const currShakeStrength = this.shakeStrength * decayFactor
        this.object.position.y =
            this.initialObjectPos.y +
            Math.sin((currDuration / this.shakeFrequency) * Math.PI * 2) * currShakeStrength
    }

    end() {
        this.object.position.copy(this.initialObjectPos)
    }
}
