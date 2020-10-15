import { magStateToBoardState } from "../state_manager/stateConversion"
import { calcStateDelta } from "../state_manager/state_delta/stateDelta"
import { updateBoardByDelta } from "./boardUpdate"
import { MagState } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import World from "../world/World"
import { Anim } from "../animation_manager/animationTypes"
import worldSimulationUpdate from "./simulation/worldSimulationUpdate"

export const updateWorldWithState = (
    state: MagState,
    prevState: MagState | null,
    world: World,
): Anim => {
    if (state.simulationStates.length === 0) {
        const prevBoardState = prevState && magStateToBoardState(prevState)
        const boardState = magStateToBoardState(state)
        const stateDelta = calcStateDelta(prevBoardState, boardState)
        const updateStateAnim = updateBoardByDelta(stateDelta, world.visBoard)
        return updateStateAnim
    } else {
        const simAnim = worldSimulationUpdate(prevState, state, {
            scene: world.scene,
            visBoard: world.visBoard,
            audioManager: world.audioManager,
        })
        return simAnim
    }
}
