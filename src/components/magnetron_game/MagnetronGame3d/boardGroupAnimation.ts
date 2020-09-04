import * as THREE from "three"
import { StaticBoard } from "./board"
import { VisBoardPlate, resetBoardObjectCellPositions } from "./boardVisObject"
import { range } from "../../utils/arrayUtils"
import { Animation } from "./animation"
import { Magnetron } from "./magnetron"

export class BoardGroupAnimation extends Animation {
    private readonly boardObject: VisBoardPlate
    private readonly staticBoard: StaticBoard

    constructor(staticBoard: StaticBoard, boardObject: VisBoardPlate) {
        super(4, false)
        this.staticBoard = staticBoard
        this.boardObject = boardObject
    }

    public update = (game: Magnetron, deltaTime: number) => {
        this.currDuration += deltaTime
        const durationFactor = this.currDuration / this.duration
        const durationFactorSquared = Math.pow(durationFactor, 10)

        const distanceFactor = 10 * (1 - durationFactorSquared) + 1
        const rotation = (Math.PI / 2) * (1 - durationFactor)
        this.positionCells(distanceFactor, rotation)

        if (this.currDuration >= this.duration) {
            resetBoardObjectCellPositions(this.staticBoard, this.boardObject)
            return false
        } else {
            return true
        }
    }

    private positionCells = (distanceFactor: number, rotation: number) => {
        range(this.staticBoard.cellCount.x).forEach((x) => {
            range(this.staticBoard.cellCount.y).forEach((y) => {
                const cellStaticPos = this.staticBoard.cellsCenterPosition[x][y]
                const cellMesh = this.boardObject.cells[x][y]

                const cellStaticRelPos = new THREE.Vector2().subVectors(
                    cellStaticPos,
                    this.staticBoard.center,
                )
                const cellPos = cellStaticRelPos
                    .clone()
                    .multiplyScalar(distanceFactor)
                    .rotateAround(this.staticBoard.center, rotation)
                    .add(this.staticBoard.center)

                cellMesh.position.x = cellPos.x
                cellMesh.position.z = cellPos.y
            })
        })
    }

    protected start(game: Magnetron): void {}
    protected end(game: Magnetron): void {}
}
