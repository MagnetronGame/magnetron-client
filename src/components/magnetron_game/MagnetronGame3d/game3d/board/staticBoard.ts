import * as THREE from "three"
import { MagStaticState } from "../../../../../services/magnetronServerService/types/gameTypes/staticStateTypes"
import { range } from "../../../../../utils/arrayUtils"
import { Vec2I } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"

export type StaticBoard = {
    size: THREE.Vector2
    thickness: number
    center: THREE.Vector2

    cellCount: THREE.Vector2

    cellSize: THREE.Vector2
    cellsCenterPosition: THREE.Vector2[][]

    edgeThickness: number
    edgeWidth: number

    boardToWorldPos: (boardPos: Vec2I) => THREE.Vector3
}

export const createStaticBoard = (staticState: MagStaticState): StaticBoard => {
    const cellCount = new THREE.Vector2(staticState.boardWidth, staticState.boardHeight)

    const size = new THREE.Vector2(1, 1)
    const thickness = 0.1

    const center = new THREE.Vector2(0, 0)

    const edgeThickness = 0.01
    const edgeWidth = 0.015

    const cellSize = size.clone().divide(cellCount)
    const cellSizeHalf = cellSize.clone().multiplyScalar(0.5)
    const relativeCenter = center.clone().sub(size.clone().multiplyScalar(0.5))

    const cellsCenterPosition = range(cellCount.x).map((x) =>
        range(cellCount.y).map((y) => {
            const position = new THREE.Vector2(x, y)
                .multiply(cellSize)
                .add(cellSizeHalf)
                .add(relativeCenter)
            return position
        }),
    )

    const boardToWorldPos = (boardPos: Vec2I): THREE.Vector3 => {
        const pos = cellsCenterPosition[boardPos.x][boardPos.y]
        return new THREE.Vector3(pos.x, thickness / 2, pos.y)
    }

    const staticBoard: StaticBoard = {
        size,
        thickness,
        center,
        cellCount,
        cellSize,
        cellsCenterPosition,
        edgeThickness,
        edgeWidth,
        boardToWorldPos,
    }

    return staticBoard
}
