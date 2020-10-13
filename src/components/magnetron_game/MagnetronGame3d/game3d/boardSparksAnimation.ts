import * as THREE from "three"
import { Board } from "./board/board"
import { Anims } from "./animation/animationHelpers"
import MagnetronTheme from "../../../MagnetronTheme"
import { Anim } from "./animation/animationTypes"
import { ParticleColor, ParticleSystemConfig } from "./particleSystem/particleSystemTypes"
import ParticleSystemAnim from "./particleSystem/particleSystemAnim"

export default (scene: THREE.Scene, board: Board, originalBackground: THREE.Color): Anim => {
    const boardCenter = new THREE.Vector3(
        board.staticBoard!.center.x,
        board.staticBoard.thickness,
        board.staticBoard.center.y,
    )
    const boardSparksParticlesConfig = (color: ParticleColor): ParticleSystemConfig => {
        return {
            formation: {
                formation: "rectangle",
                widthInner: board.staticBoard.size.x / 2,
                widthOuter: board.staticBoard.size.x,
                heightInner: board.staticBoard.size.y / 2,
                heightOuter: board.staticBoard.size.y,
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
