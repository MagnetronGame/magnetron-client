import { Vec2I } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { getSortedAvatarsWorldPos } from "../board/visBoardHelpers"
import World from "./World"

export const getAvatarsScreenPosition = (world: World): Vec2I[] => {
    return getSortedAvatarsWorldPos(world.visBoard).map((worldPos) =>
        world.worldToScreenPos(worldPos),
    )
}
