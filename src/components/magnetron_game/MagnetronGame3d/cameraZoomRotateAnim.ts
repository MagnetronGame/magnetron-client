import * as THREE from "three"
import { Anim } from "./animation/animationTypes"

function setCameraOffset(camera: THREE.Camera, distance: number, angle: number, endHeight: number) {
    const upVec = new THREE.Vector3(0, 1, 1)
    const startOffset = new THREE.Vector3(0, endHeight, distance).applyAxisAngle(upVec, angle)

    camera.position.copy(startOffset)

    camera.lookAt(0, 0, 0)
}

export default (
    camera: THREE.Camera,
    startDistance: number,
    endDistance: number,
    startAngle: number,
    endHeight: number,
    duration: number,
): Anim => ({
    duration,
    start: () => setCameraOffset(camera, startDistance, startAngle, endHeight),
    update: ({ durationRatio, durationRatioInv }) => {
        const currDistance = startDistance * durationRatioInv + endDistance * durationRatio
        const currAngle = startAngle * durationRatioInv
        setCameraOffset(camera, currDistance, currAngle, endHeight)
    },
    end: () => setCameraOffset(camera, endDistance, 0, endHeight),
})
