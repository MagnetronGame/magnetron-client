import * as THREE from "three"
import { range } from "../../../../../../utils/arrayUtils"
import { VisPiece } from "./visualObjects/visPieces"
import boardVisObject, { VisBoardPlate } from "./visualObjects/visBoardPlate"
import { Vec2I } from "../../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { MagStaticState } from "../../../../../../services/magnetronServerService/types/gameTypes/staticStateTypes"
import { Piece } from "../../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { createStaticBoard, StaticBoard } from "./staticBoard"

export class Board {
    public readonly staticBoard: StaticBoard
    public readonly visBoardPlate: VisBoardPlate
    public readonly visPiecesContainer: THREE.Group
    public readonly visBoardContainer: THREE.Group

    readonly visBoardPieces: VisPiece[][][]

    public onVisPieceChange:
        | ((type: "add" | "remove" | "move", visPiece: VisPiece) => void)
        | undefined = undefined

    constructor(staticState: MagStaticState) {
        this.staticBoard = createStaticBoard(staticState)
        this.visBoardPlate = boardVisObject(this.staticBoard)
        this.visPiecesContainer = new THREE.Group()
        this.visBoardContainer = new THREE.Group()

        this.visBoardContainer.add(this.visBoardPlate.object)
        this.visBoardContainer.add(this.visPiecesContainer)

        this.visBoardPieces = range(staticState.boardWidth).map((x) =>
            range(staticState.boardHeight).map((y) => []),
        )
    }

    public getRootNode(): THREE.Object3D {
        return this.visBoardContainer
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

    public getPiecesCurrentWorldPosOfType<T extends Piece>(type: string): [T, THREE.Vector3][] {
        const allVisPieces = this.visBoardPieces.flat(3) as VisPiece[]

        const visPiecesWithCurrentWorldPos = allVisPieces
            .filter((visPiece) => visPiece.pieceData.type === type)
            .map((visPiece) => [visPiece.pieceData as T, visPiece.pieceObject.position]) as [
            T,
            THREE.Vector3,
        ][]
        return visPiecesWithCurrentWorldPos
    }

    public changeVisPiecePosition(visPiece: VisPiece, position: THREE.Vector3) {
        visPiece.pieceObject.position.copy(position)
        this.onVisPieceChange && this.onVisPieceChange("move", visPiece)
    }

    public attachVisPiece(visPiece: VisPiece, boardPos: Vec2I) {
        this.setVisPieces(boardPos, [...this.getVisPieces(boardPos), visPiece])
    }

    public detachVisPiece(visPiece: VisPiece, boardPos: Vec2I) {
        this.setVisPieces(
            boardPos,
            this.getVisPieces(boardPos).filter((_visPiece) => _visPiece !== visPiece),
        )
    }

    public retatchVisPiece(visPiece: VisPiece, fromBoardPos: Vec2I, toBoardPos: Vec2I) {
        this.detachVisPiece(visPiece, fromBoardPos)
        this.attachVisPiece(visPiece, toBoardPos)
    }

    public boardPosToWorldPos(boardPos: Vec2I): THREE.Vector3 {
        const pos = this.staticBoard.cellsCenterPosition[boardPos.x][boardPos.y]
        return new THREE.Vector3(pos.x, this.staticBoard.thickness / 2, pos.y)
    }

    public addVisPieceGraphics(visPiece: VisPiece, boardPos: Vec2I) {
        const pieceObject = visPiece.pieceObject
        const pos = this.boardPosToWorldPos(boardPos)
        pieceObject.position.copy(pos)
        this.visPiecesContainer.add(visPiece.pieceObject)
        this.onVisPieceChange && this.onVisPieceChange("add", visPiece)
    }

    public removeVisPieceGraphics(visPiece: VisPiece) {
        this.visPiecesContainer.remove(visPiece.pieceObject)
        this.onVisPieceChange && this.onVisPieceChange("remove", visPiece)
    }

    private getVisPieces(pos: Vec2I): VisPiece[] {
        return this.visBoardPieces[pos.x][pos.y]
    }

    private setVisPieces(boardPos: Vec2I, visPieces: VisPiece[]) {
        this.visBoardPieces[boardPos.x][boardPos.y] = visPieces
    }

    private getVisPiece(boardPos: Vec2I, pieceId: string): VisPiece | null {
        return (
            this.getVisPieces(boardPos).find((_visPiece) => _visPiece.pieceData.id === pieceId) ||
            null
        )
    }
}
