import * as THREE from "three"
import { SingleAnim } from "../../../animation_manager/animationTypes"

export default (
    obj: THREE.Object3D,
    startPos: THREE.Vector3,
    endPos: THREE.Vector3,
    duration: number = 1,
): SingleAnim => ({
    duration,
    name: "position transform",
    start: () => obj.position.copy(startPos),
    update: ({ durationRatio, durationRatioInv }) => {
        const startPosRatio = startPos.clone().multiplyScalar(durationRatioInv)
        const endPosRatio = endPos.clone().multiplyScalar(durationRatio)
        const intermediatePosition = new THREE.Vector3().addVectors(startPosRatio, endPosRatio)
        obj.position.copy(intermediatePosition)
    },
    end: () => obj.position.copy(endPos),
})
