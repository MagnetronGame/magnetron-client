import * as THREE from "three"
import { Animation } from "./animation"
import { Magnetron } from "./magnetron"

export class OpacityAnimation extends Animation {
    private readonly object: THREE.Object3D
    private readonly startOpacity: number
    private readonly endOpacity: number

    constructor(
        object: THREE.Object3D,
        startOpacity: number,
        endOpacity: number,
        duration: number,
    ) {
        super(duration, false)
        this.object = object
        this.startOpacity = startOpacity
        this.endOpacity = endOpacity
    }

    private setOpacityRecursive(object: THREE.Object3D, opacity: number) {
        object.children.forEach((child) => {
            this.setOpacityRecursive(child, opacity)
        })

        const isMesh = (object: THREE.Object3D): object is THREE.Mesh => {
            return (object as THREE.Mesh).isMesh !== undefined
        }

        if (isMesh(object)) {
            if (object.material) {
                if (object.material instanceof THREE.Material) {
                    if (opacity === 1) {
                        object.material.transparent = false
                        object.material.opacity = 1
                    } else {
                        object.material.transparent = true
                        object.material.opacity = opacity
                    }
                }
            }
        }
    }

    protected start(game: Magnetron): void {
        this.setOpacityRecursive(this.object, this.startOpacity)
    }

    protected update(game: Magnetron, deltaTime: number): void {
        const durationFactor = this.currDuration / this.duration
        const currOpacity =
            this.startOpacity * (1 - durationFactor) + this.endOpacity * durationFactor
        this.setOpacityRecursive(this.object, currOpacity)
    }

    protected end(game: Magnetron): void {
        this.setOpacityRecursive(this.object, this.endOpacity)
    }
}
