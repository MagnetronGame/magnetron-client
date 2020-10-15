import * as THREE from "three"
import { Anims } from "../../animation_manager/animationHelpers"
import { AudioManager, MagAudio } from "../../world/asset_managers/AudioManager"
import sceneBackgroundFadeAnim from "../../world/animations/sceneBackgroundFadeAnim"
import ShakeAnimation from "../../world/animations/ShakeAnimation"
import boardSparksAnimation from "../../world/board/animations/boardSparksAnimation"
import { calcStateDeltasBetween } from "../../state_manager/state_delta/stateDelta"
import { updateBoardByDelta } from "../boardUpdate"
import { VisBoard } from "../../world/board/visualObjects/visBoard"
import { ChainedAnims } from "../../animation_manager/animationTypes"
import { MagState } from "../../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { magStateToBoardState, simStatesToBoardStates } from "../../state_manager/stateConversion"

export type SimulationAssets = {
    visBoard: VisBoard
    audioManager: AudioManager
    scene: THREE.Scene
}

export default (
    prevState: MagState | null,
    state: MagState,
    assets: SimulationAssets,
): ChainedAnims => {
    const visBoard = assets.visBoard
    const allBoardStates = [
        prevState && magStateToBoardState(prevState),
        ...simStatesToBoardStates(state.simulationStates),
        magStateToBoardState(state),
    ]
    const allSimDeltas = calcStateDeltasBetween(allBoardStates)
    const allSimStateUpdateAnims = allSimDeltas.map((delta) => updateBoardByDelta(delta, visBoard))

    const lastTurnAnim = allSimStateUpdateAnims[0]
    const simEndAnim = allSimStateUpdateAnims[allSimStateUpdateAnims.length - 1]
    const simAnims = allSimStateUpdateAnims.slice(1, -1)

    const standardSceneBackground = (assets.scene.background as THREE.Color).clone()
    const simulateSceneBackground = new THREE.Color("#011333")

    return Anims.chained(
        [
            {
                duration: 0,
                start: () => {
                    assets.audioManager.stopAudio(MagAudio.BACKGROUND)
                    assets.audioManager.playAudio(MagAudio.BACKGROUND_SIMULATION, 0.8, true)
                },
            },
            { duration: 2 },
            sceneBackgroundFadeAnim(assets.scene, simulateSceneBackground, 0.5),
            Anims.parallel([
                new ShakeAnimation(visBoard.getRootNode(), 0.4, 0.1),
                boardSparksAnimation(assets.scene, visBoard.staticBoard),
            ]),
            lastTurnAnim,
            { duration: 5 },
            Anims.chained(simAnims),
            { duration: 2 },
            sceneBackgroundFadeAnim(assets.scene, standardSceneBackground, 0.2),
            {
                duration: 0,
                start: () => {
                    assets.audioManager.stopAudio(MagAudio.BACKGROUND_SIMULATION)
                    assets.audioManager.playAudio(MagAudio.BACKGROUND, 0.5, true)
                },
            },
            simEndAnim,
        ],
        "simulation",
    )
}
