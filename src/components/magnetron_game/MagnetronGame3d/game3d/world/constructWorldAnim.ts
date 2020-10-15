import * as THREE from "three"
import { Anims, Duration } from "../animation_manager/animationHelpers"
import { MagAudio } from "./asset_managers/AudioManager"
import visBoardCreationAnim from "./board/animations/visBoardCreationAnim"

import cameraMovementAnim from "./animations/cameraMovementAnim"
import { Anim, ChainedAnims, SingleAnim } from "../animation_manager/animationTypes"
import World from "./World"
import cameraZoomRotateAnim from "./animations/cameraZoomRotateAnim"

export default (world: World): ChainedAnims => {
    const topLight = new THREE.DirectionalLight(0xffffff, 0.9)
    topLight.position.set(-1, 2, 1)
    const topLightAnim: SingleAnim = {
        name: "top light movement",
        context: "main-parallel",
        duration: Duration.INF,
        start: () => world.scene.add(topLight),
        update: ({ currDuration }) =>
            topLight.position.set(Math.cos(currDuration) * 3, 10, Math.sin(currDuration) * 3),
    }

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.3)
    frontLight.position.set(0, 0, 10)
    const frontLightAnim: SingleAnim = {
        name: "add front light",
        duration: 0,
        start: () => world.scene.add(frontLight),
    }

    const playBackgroundMusicAnim: SingleAnim = {
        duration: 0,
        start: () => world.audioManager.playAudio(MagAudio.BACKGROUND, 0.5, true),
    }

    const constructBoardPlateAnim: Anim = visBoardCreationAnim(world.visBoard)

    const initialCameraMovementAnim: Anim = cameraZoomRotateAnim(
        world.camera,
        5,
        0.6,
        -Math.PI / 2,
        1,
        7,
    )

    return Anims.chained([
        Anims.parallel(
            [
                playBackgroundMusicAnim,
                constructBoardPlateAnim,
                initialCameraMovementAnim,
                topLightAnim,
                frontLightAnim,
            ],
            "Create board and initial camera motion",
        ),
        cameraMovementAnim(world.camera),
    ])
}
