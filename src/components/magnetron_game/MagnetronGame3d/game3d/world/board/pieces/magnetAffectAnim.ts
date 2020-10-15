import * as THREE from "three"
import { Anim } from "../../../animation_manager/animationTypes"
import { ParticleColor } from "../../../particleSystem/particleSystemTypes"
import ParticleSystemAnim from "../../../particleSystem/particleSystemAnim"
import { UP_VEC } from "../../../particleSystem/particleSystemUtils"
import { Anims } from "../../../animation_manager/animationHelpers"

export default (
    parentObject: THREE.Object3D,
    avatarPos: THREE.Vector3,
    magnetPos: THREE.Vector3,
    towardsAvatar: boolean,
    cellWidth: number,
    cellHeight: number,
    color: ParticleColor,
): Anim => {
    const startPos = towardsAvatar ? avatarPos : magnetPos
    const endPos = towardsAvatar ? magnetPos : avatarPos
    const distanceVec = endPos.clone().sub(startPos)

    const magnetAffect = new ParticleSystemAnim(parentObject, 1.5, {
        formation: {
            formation: "circle",
            radiusInner: 0,
            radiusOuter: (cellWidth / 2) * 0.4,
        },
        centerPosition: startPos,
        direction: distanceVec,
        color: color,
        particleSizeMin: 0.02,
        particleCount: 30,
        particleSpeedMax: distanceVec.length() * 1.2,
        particleSpeedMin: 0,
        particleSpread: 0.2,
        // distanceSpeedFactor: 0.01,
    })

    const magnetGlow = new ParticleSystemAnim(parentObject, 1.5, {
        formation: {
            formation: "rectangle",
            widthInner: cellWidth * 0.9,
            widthOuter: cellWidth,
            heightInner: cellHeight * 0.9,
            heightOuter: cellHeight,
        },
        centerPosition: magnetPos,
        direction: UP_VEC,
        color: color,
        particleSizeMin: 0.007,
        particleCount: 300,
        particleSpeedMax: 0.01,
        particleSpeedMin: 0,
        particleSpread: 0.3,
    })

    return Anims.parallel([magnetGlow, magnetAffect])
}
