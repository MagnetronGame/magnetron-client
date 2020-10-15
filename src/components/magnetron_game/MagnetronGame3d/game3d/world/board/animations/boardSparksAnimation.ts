import * as THREE from "three"
import { Anims } from "../../../animation_manager/animationHelpers"
import { Anim } from "../../../animation_manager/animationTypes"
import { ParticleColor, ParticleSystemConfig } from "../../../particleSystem/particleSystemTypes"
import ParticleSystemAnim from "../../../particleSystem/particleSystemAnim"
import MagnetronTheme from "../../../../../../../MagnetronTheme"
import { StaticBoard } from "../staticBoard"

export default (scene: THREE.Scene, staticBoard: StaticBoard): Anim => {
    const boardCenter = new THREE.Vector3(
        staticBoard.center.x,
        staticBoard.thickness,
        staticBoard.center.y,
    )
    const boardSparksParticlesConfig = (color: ParticleColor): ParticleSystemConfig => {
        return {
            formation: {
                formation: "rectangle",
                widthInner: staticBoard.size.x / 2,
                widthOuter: staticBoard.size.x,
                heightInner: staticBoard.size.y / 2,
                heightOuter: staticBoard.size.y,
            },
            centerPosition: new THREE.Vector3(0, 0.2, 0).add(boardCenter),
            color: color,
            particleSizeMin: 0.01,
            particleCount: 300,
            distanceSpeedFactor: 0.6,
        }
    }

    return Anims.parallel([
        new ParticleSystemAnim(
            scene,
            1,
            boardSparksParticlesConfig(MagnetronTheme.magnet.positiveColor.standard),
        ),
        Anims.chained([
            { duration: 0.2 },
            new ParticleSystemAnim(
                scene,
                1,
                boardSparksParticlesConfig(MagnetronTheme.magnet.baseColorInner),
            ),
        ]),
        Anims.chained([
            { duration: 0.4 },
            new ParticleSystemAnim(
                scene,
                1,
                boardSparksParticlesConfig(MagnetronTheme.magnet.negativeColor.standard),
            ),
        ]),
    ])
}
