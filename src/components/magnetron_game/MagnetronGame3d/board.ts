import * as THREE from "three"
import { range } from "../../utils/arrayUtils"
import {
    MagState,
    Piece,
    StaticPieces,
    Vec2I,
} from "../../services/magnetronServerService/magnetronGameTypes"
import { createVisPiece, EmptyVisPiece, VisPiece } from "./visPieces"
import { ChainedAnimations } from "./chainedAnimations"
import { BoardGroupAnimation } from "./boardGroupAnimation"
import { ParallelAnimations } from "./parallelAnimations"
import { ShakeAnimation } from "./shakeAnimation"
import { OpacityAnimation } from "./OpacityAnimation"
import { ParticleSystem } from "./particleSystem"
import boardVisObject, { VisBoardPlate } from "./boardVisObject"
import { Animation } from "./animation"
import { InlineAnimation } from "./InlineAnimation"

export class Board {
    public readonly staticBoard: StaticBoard
    public readonly visBoardPlate: VisBoardPlate
    public readonly visPiecesContainer: THREE.Group
    public readonly visBoardContainer: THREE.Group

    readonly pieces: VisPiece[][]

    constructor(state: MagState) {
        this.staticBoard = createStaticBoard(state)
        this.visBoardPlate = boardVisObject(this.staticBoard)
        this.visPiecesContainer = new THREE.Group()

        this.visBoardContainer = new THREE.Group() // this should be added to the scene
        this.visBoardContainer.add(this.visBoardPlate.object)
        this.visBoardContainer.add(this.visPiecesContainer)

        this.pieces = range(state.staticState.boardWidth).map((x) =>
            range(state.staticState.boardHeight).map((y) => EmptyVisPiece),
        )
    }

    public getCreationAnimation(): Animation {
        const boardCreationAnimation = new ChainedAnimations([
            new InlineAnimation({ end: () => (this.visPiecesContainer.visible = false) }),
            new BoardGroupAnimation(this.staticBoard, this.visBoardPlate),
            new ParallelAnimations([
                new ShakeAnimation(this.visBoardPlate.object, 1, 0.1),
                new OpacityAnimation(this.visBoardPlate.edgesRow[0], 0, 1, 0.5),
                new ParticleSystem(1, new THREE.Vector3(), "#7ab8ff", 0.05, 0.1),
                new ParticleSystem(1.3, new THREE.Vector3(), "#ffffcc", 0.01, -0.004),
            ]),
            new InlineAnimation({ end: () => (this.visPiecesContainer.visible = true) }),
        ])
        return boardCreationAnimation
    }

    public putPiece(piece: Piece, boardPos: Vec2I) {
        const oldVisPiece = this.getVisPiece(boardPos)
        this.visPiecesContainer.remove(oldVisPiece.pieceObject)

        const visPiece = createVisPiece(piece, this.staticBoard)
        this.pieces[boardPos.x][boardPos.y] = visPiece

        const pieceObject = visPiece.pieceObject
        const pos = this.staticBoard.cellsCenterPosition[boardPos.x][boardPos.y]
        pieceObject.position.set(pos.x, this.staticBoard.thickness / 2, pos.y)
        this.visPiecesContainer.add(visPiece.pieceObject)
    }

    public removePiece(pos: Vec2I) {
        this.putPiece(StaticPieces.EMPTY, pos)
    }

    private getVisPiece(pos: Vec2I): VisPiece {
        return this.pieces[pos.x][pos.y]
    }

    public getPiece(pos: Vec2I): Piece {
        return this.getVisPiece(pos).pieceData
    }
}

export type StaticBoard = {
    size: THREE.Vector2
    thickness: number
    center: THREE.Vector2

    cellCount: THREE.Vector2

    cellSize: THREE.Vector2
    cellsCenterPosition: THREE.Vector2[][]

    edgeThickness: number
    edgeWidth: number
}

export const createStaticBoard = (state: MagState): StaticBoard => {
    const cellCount = new THREE.Vector2(state.staticState.boardWidth, state.staticState.boardHeight)

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

    const staticBoard: StaticBoard = {
        size,
        thickness,
        center,
        cellCount,
        cellSize,
        cellsCenterPosition,
        edgeThickness,
        edgeWidth,
    }

    return staticBoard
}
