import * as THREE from "three"
import { range } from "../../../utils/arrayUtils"
import { MagState, Piece, Vec2I } from "../../../services/magnetronServerService/magnetronGameTypes"
import { createVisPiece, VisPiece } from "./visPieces"
import boardVisObject, { VisBoardPlate } from "./boardVisObject"
import { Anim, SingleAnim } from "./animation/animationTypes"
import boardGroupAnim from "./boardGroupAnim"
import { Anims } from "./animation/animationHelpers"
import ShakeAnimation from "./ShakeAnimation"
import opacityAnim from "./opacityAnim"
import * as vec2i from "../../../utils/vec2IUtils"
import ParticleSystemAnim from "./particleSystem/particleSystemAnim"
import { UP_VEC } from "./particleSystem/particleSystemUtils"

export class Board {
    public readonly staticBoard: StaticBoard
    public readonly visBoardPlate: VisBoardPlate
    public readonly visPiecesContainer: THREE.Group
    public readonly visBoardContainer: THREE.Group

    readonly pieces: VisPiece[][][]
    readonly pieceEqualsFunc: (p1: Piece, p2: Piece) => boolean

    constructor(state: MagState, pieceEqualsFunc: (p1: Piece, p2: Piece) => boolean) {
        this.staticBoard = createStaticBoard(state)
        this.visBoardPlate = boardVisObject(this.staticBoard)
        this.visPiecesContainer = new THREE.Group()
        this.visBoardContainer = new THREE.Group() // this should be added to the scene

        this.visBoardContainer.add(this.visBoardPlate.object)
        this.visBoardContainer.add(this.visPiecesContainer)

        this.pieces = range(state.staticState.boardWidth).map((x) =>
            range(state.staticState.boardHeight).map((y) => []),
        )

        this.pieceEqualsFunc = pieceEqualsFunc
    }

    public getCreationAnimation(): Anim {
        const boardCreationAnimation: Anim = Anims.chained([
            // { duration: 0, end: () => (this.visPiecesContainer.visible = false) },
            boardGroupAnim(this.staticBoard, this.visBoardPlate),
            Anims.parallel(
                [
                    new ShakeAnimation(this.visBoardPlate.object, 1, 0.1),
                    opacityAnim(this.visBoardPlate.edgesRow[0], 0.5, 0, 1),
                    new ParticleSystemAnim(
                        this.visBoardContainer.parent || this.visBoardContainer,
                        1,
                        {
                            formation: {
                                formation: "sphere",
                                radiusInner: 0,
                                radiusOuter: (this.staticBoard.size.x / 2) * 3,
                            },
                            centerPosition: new THREE.Vector3(),
                            color: "#7ab8ff",
                            particleSizeMin: 0.05,
                            distanceSpeedFactor: 3,
                            particlePositionDistortMax: 0.5,
                            particleCount: 1800,
                        },
                    ),
                    new ParticleSystemAnim(
                        this.visBoardContainer.parent || this.visBoardContainer,
                        1.3,
                        {
                            formation: {
                                formation: "rectangle",
                                widthInner: 0,
                                widthOuter: this.staticBoard.size.x,
                                heightInner: 0,
                                heightOuter: this.staticBoard.size.y,
                            },
                            centerPosition: new THREE.Vector3(
                                this.staticBoard.center.x,
                                0.1,
                                this.staticBoard.center.y,
                            ),
                            direction: UP_VEC,
                            color: "#ffffcc",
                            particleSizeMin: 0.01,
                            distanceSpeedFactor: -0.24,
                            particlePositionDistortMax: 0.1,
                            particleSpeedMax: 0.5,
                            particleCount: 500,
                        },
                    ),
                ],
                "board implode",
            ),
            // { name: "set pieces ", duration: 0, end: () => (this.visPiecesContainer.visible = true) },
        ])
        return boardCreationAnimation
    }

    public addPiece(piece: Piece, boardPos: Vec2I, instant?: boolean): Anim {
        const visPiece = createVisPiece(piece, this.staticBoard)
        this.attachVisPiece(visPiece, boardPos)
        const anim: SingleAnim = {
            name: `Add piece at ${vec2i.toString(boardPos)}: ${visPiece.pieceData.type}`,
            duration: instant ? 0 : 0.5,
            start: () => {
                this.addVisPieceGraphics(visPiece, boardPos)
            },
        }
        return anim
    }

    public removePieces(boardPos: Vec2I, exceptType?: string, instant?: boolean): Anim {
        const visPieces = this.getVisPieces(boardPos).filter(
            (_visPiece) => _visPiece.type !== exceptType,
        )
        visPieces.forEach((visPiece) => this.detachVisPiece(visPiece, boardPos))

        const anims: Anim[] = visPieces.map((visPiece) => ({
            name: `Remove piece at ${vec2i.toString(boardPos)}: ${visPiece.pieceData.type}`,
            duration: instant ? 0 : 0.1,
            start: () => this.removeVisPieceGraphics(visPiece),
        }))
        return Anims.chained(anims)
    }

    public movePiece(piece: Piece, fromBoardPos: Vec2I, toBoardPos: Vec2I): Anim {
        const visPiece = this.getVisPiece(fromBoardPos, piece)
        if (!visPiece) {
            throw Error(
                `Trying to move piece that is not present. Piece type: ${
                    piece.type
                }, from boardPosition: ${vec2i.toString(fromBoardPos)}`,
            )
        }
        this.retatchVisPiece(visPiece, fromBoardPos, toBoardPos)
        const fromPos = this.boardPosToWorldPos(fromBoardPos)
        const toPos = this.boardPosToWorldPos(toBoardPos)
        const moveAnim: SingleAnim = {
            name: `Move piece ${visPiece.pieceData.type} from ${vec2i.toString(
                fromBoardPos,
            )} to ${vec2i.toString(toBoardPos)}`,
            duration: 1,
            update: ({ currDuration, duration }) => {
                const durationRatio = currDuration / duration
                const intermediatePos = fromPos
                    .clone()
                    .multiplyScalar(1 - durationRatio)
                    .add(toPos.clone().multiplyScalar(durationRatio))
                visPiece.pieceObject.position.copy(intermediatePos)
            },
            end: () => {
                visPiece.pieceObject.position.copy(toPos)
            },
        }

        return moveAnim
    }

    public isPositionInsideBoard(boardPos: Vec2I): boolean {
        return (
            boardPos.x >= 0 &&
            boardPos.x < this.staticBoard.cellCount.x &&
            boardPos.y >= 0 &&
            boardPos.y < this.staticBoard.cellCount.y
        )
    }

    public getPieceOfType(boardPos: Vec2I, type: string): Piece | null {
        return this.getPieces(boardPos).find((p) => p.type === type) || null
    }
    public getPieces(boardPos: Vec2I): Piece[] {
        return this.getVisPieces(boardPos).map((visPiece) => visPiece.pieceData)
    }

    public hasOnlyPiece(boardPos: Vec2I, piece: Piece): boolean {
        const pieces = this.getPieces(boardPos)
        return pieces.length === 1 && this.pieceEqualsFunc(pieces[0], piece)
    }

    public getPiecesWithPosOfType<T extends Piece>(type: string): [T, Vec2I][] {
        const piecesWithPos: [VisPiece, Vec2I][] = this.pieces.flatMap((pieceCol, x) =>
            pieceCol.flatMap((visPieces, y) =>
                visPieces.map<[VisPiece, Vec2I]>((visPiece) => [visPiece, { x, y }]),
            ),
        )
        return piecesWithPos
            .filter(([visPiece, _]) => visPiece.type === type)
            .map(([visPiece, pos]) => [visPiece.pieceData as T, pos])
    }

    private attachVisPiece(visPiece: VisPiece, boardPos: Vec2I) {
        this.setVisPieces(boardPos, [...this.getVisPieces(boardPos), visPiece])
    }

    private detachVisPiece(visPiece: VisPiece, boardPos: Vec2I) {
        this.setVisPieces(
            boardPos,
            this.getVisPieces(boardPos).filter((_visPiece) => _visPiece !== visPiece),
        )
    }

    private retatchVisPiece(visPiece: VisPiece, fromBoardPos: Vec2I, toBoardPos: Vec2I) {
        this.detachVisPiece(visPiece, fromBoardPos)
        this.attachVisPiece(visPiece, toBoardPos)
    }

    public boardPosToWorldPos(boardPos: Vec2I): THREE.Vector3 {
        const pos = this.staticBoard.cellsCenterPosition[boardPos.x][boardPos.y]
        return new THREE.Vector3(pos.x, this.staticBoard.thickness / 2, pos.y)
    }

    private addVisPieceGraphics(visPiece: VisPiece, boardPos: Vec2I) {
        const pieceObject = visPiece.pieceObject
        const pos = this.boardPosToWorldPos(boardPos)
        pieceObject.position.copy(pos)
        this.visPiecesContainer.add(visPiece.pieceObject)
    }

    private removeVisPieceGraphics(visPiece: VisPiece) {
        this.visPiecesContainer.remove(visPiece.pieceObject)
    }

    private getVisPieces(pos: Vec2I): VisPiece[] {
        return this.pieces[pos.x][pos.y]
    }

    private setVisPieces(boardPos: Vec2I, visPieces: VisPiece[]) {
        this.pieces[boardPos.x][boardPos.y] = visPieces
    }

    private getVisPiece(boardPos: Vec2I, piece: Piece): VisPiece | null {
        return (
            this.getVisPieces(boardPos).find((_visPiece) =>
                this.pieceEqualsFunc(_visPiece.pieceData, piece),
            ) || null
        )
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
