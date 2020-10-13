import { simulationAnim } from "../simulation/simulationAnim"
import { magStateToBoardState } from "./stateConversion"
import { calcStateDelta } from "./state_delta/stateDelta"
import { updateBoardByDelta } from "../boardUpdate"
import { MagState } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import World from "../world/World"
import { Anim } from "../animation/animationTypes"

export const updateState = (state: MagState, prevState: MagState, world: World): Anim => {
    if (state.simulationStates.length === 0) {
        const prevBoardState = prevState && magStateToBoardState(prevState)
        const boardState = magStateToBoardState(state)
        const stateDelta = calcStateDelta(prevBoardState, boardState)
        const updateStateAnim = updateBoardByDelta(stateDelta, world.visBoard)
        return updateStateAnim
    } else {
        const simAnim = simulationAnim(prevState, state, {
            scene: world.scene,
            visBoard: world.visBoard,
            audioManager: world.audioManager,
        })
        return simAnim
    }
}
