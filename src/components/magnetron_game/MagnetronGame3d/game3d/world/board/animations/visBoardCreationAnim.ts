import { Anim } from "../../../animation_manager/animationTypes"
import { Anims } from "../../../animation_manager/animationHelpers"
import boardGroupAnim from "./boardGroupAnim"
import ShakeAnimation from "../../animations/ShakeAnimation"
import opacityAnim from "../../animations/opacityAnim"
import ParticleSystemAnim from "../../../particleSystem/particleSystemAnim"
import * as THREE from "three"
import { UP_VEC } from "../../../particleSystem/particleSystemUtils"
import { VisBoardPlate } from "../visualObjects/visBoardPlate"
import { StaticBoard } from "../staticBoard"
import { VisBoard } from "../visualObjects/visBoard"

export default (visBoard: VisBoard): Anim =>
    visBoardPlateCreationAnim(
        visBoard.getBoardPlate(),
        visBoard.staticBoard,
        visBoard.getRootNode().parent || visBoard.getRootNode(),
    )

const visBoardPlateCreationAnim = (
    visBoardPlate: VisBoardPlate,
    staticBoard: StaticBoard,
    particlesRoot: THREE.Object3D,
): Anim => {
    const groupExplosionParticles = new ParticleSystemAnim(particlesRoot, 1, {
        formation: {
            formation: "sphere",
            radiusInner: 0,
            radiusOuter: (staticBoard.size.x / 2) * 3,
        },
        centerPosition: new THREE.Vector3(),
        color: "#7ab8ff",
        particleSizeMin: 0.05,
        distanceSpeedFactor: 3,
        particlePositionDistortMax: 0.5,
        particleCount: 1800,
    })

    const boardPowderParticles = new ParticleSystemAnim(particlesRoot, 1.3, {
        formation: {
            formation: "rectangle",
            widthInner: 0,
            widthOuter: staticBoard.size.x,
            heightInner: 0,
            heightOuter: staticBoard.size.y,
        },
        centerPosition: new THREE.Vector3(staticBoard.center.x, 0.1, staticBoard.center.y),
        direction: UP_VEC,
        color: "#ffffcc",
        particleSizeMin: 0.01,
        distanceSpeedFactor: -0.24,
        particlePositionDistortMax: 0.1,
        particleSpeedMax: 0.5,
        particleCount: 500,
    })

    return Anims.chained(
        [
            boardGroupAnim(staticBoard, visBoardPlate),
            Anims.parallel(
                [
                    new ShakeAnimation(visBoardPlate.object, 1, 0.1),
                    opacityAnim(visBoardPlate.edgesRow[0], 0.5, 0, 1),
                    groupExplosionParticles,
                    boardPowderParticles,
                ],
                "board join",
            ),
        ],
        "board creation",
    )
}