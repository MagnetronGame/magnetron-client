import * as THREE from "three"
import { resetVisBoardPlateCellPositions, VisBoardPlate } from "../visualObjects/visBoardPlate"
import { Anim } from "../../../animation_manager/animationTypes"
import { StaticBoard } from "../staticBoard"
import { range } from "../../../../../../../utils/arrayUtils"

const positionCells = (
    staticBoard: StaticBoard,
    boardObject: VisBoardPlate,
    distanceFactor: number,
    rotation: number,
) => {
    range(staticBoard.cellCount.x).forEach((x) => {
        range(staticBoard.cellCount.y).forEach((y) => {
            const cellStaticPos = staticBoard.cellsCenterPosition[x][y]
            const cellMesh = boardObject.cells[x][y]

            const cellStaticRelPos = new THREE.Vector2().subVectors(
                cellStaticPos,
                staticBoard.center,
            )
            const cellPos = cellStaticRelPos
                .clone()
                .multiplyScalar(distanceFactor)
                .rotateAround(staticBoard.center, rotation)
                .add(staticBoard.center)

            cellMesh.position.x = cellPos.x
            cellMesh.position.z = cellPos.y
        })
    })
}

export default (staticBoard: StaticBoard, boardObject: VisBoardPlate): Anim => ({
    name: "group board pieces",
    duration: 4,
    update: ({ durationRatio, durationRatioInv }) => {
        const durationRatioSquared = Math.pow(durationRatio, 20)

        const distanceFactor = 10 * (1 - durationRatioSquared) + 1
        const rotation = (Math.PI / 2) * durationRatioInv
        positionCells(staticBoard, boardObject, distanceFactor, rotation)
    },
    end: () => resetVisBoardPlateCellPositions(staticBoard, boardObject),
})

//
// export class BoardGroupAnimation extends Animation {
//     private readonly boardObject: VisBoardPlate
//     private readonly staticBoard: StaticBoard
//
//     constructor(staticBoard: StaticBoard, boardObject: VisBoardPlate) {
//         super(4, false)
//         this.staticBoard = staticBoard
//         this.boardObject = boardObject
//     }
//
//     public update = (game: Magnetron3d, deltaTime: number) => {
//         this.currDuration += deltaTime
//         const durationFactor = this.currDuration / this.duration
//         const durationFactorSquared = Math.pow(durationFactor, 10)
//
//         const distanceFactor = 10 * (1 - durationFactorSquared) + 1
//         const rotation = (Math.PI / 2) * (1 - durationFactor)
//         this.positionCells(distanceFactor, rotation)
//
//         if (this.currDuration >= this.duration) {
//             resetBoardObjectCellPositions(this.staticBoard, this.boardObject)
//             return false
//         } else {
//             return true
//         }
//     }
//
//     private positionCells = (distanceFactor: number, rotation: number) => {
//         range(this.staticBoard.cellCount.x).forEach((x) => {
//             range(this.staticBoard.cellCount.y).forEach((y) => {
//                 const cellStaticPos = this.staticBoard.cellsCenterPosition[x][y]
//                 const cellMesh = this.boardObject.cells[x][y]
//
//                 const cellStaticRelPos = new THREE.Vector2().subVectors(
//                     cellStaticPos,
//                     this.staticBoard.center,
//                 )
//                 const cellPos = cellStaticRelPos
//                     .clone()
//                     .multiplyScalar(distanceFactor)
//                     .rotateAround(this.staticBoard.center, rotation)
//                     .add(this.staticBoard.center)
//
//                 cellMesh.position.x = cellPos.x
//                 cellMesh.position.z = cellPos.y
//             })
//         })
//     }
//
//     protected start(game: Magnetron3d): void {}
//     protected end(game: Magnetron3d): void {}
// }
