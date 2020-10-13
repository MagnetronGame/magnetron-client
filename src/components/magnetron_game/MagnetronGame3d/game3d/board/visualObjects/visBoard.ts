import { createStaticBoard, StaticBoard } from "../staticBoard"
import boardVisObject, { VisBoardPlate } from "./visBoardPlate"
import * as THREE from "three"
import { createVisPiece, VisPiece } from "./visPieces"
import { MagStaticState } from "../../../../../../services/magnetronServerService/types/gameTypes/staticStateTypes"
import { Vec2I } from "../../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { Piece } from "../../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { Anim, SingleAnim } from "../../animation/animationTypes"
import * as vec2i from "*"

export class VisBoard {
    public readonly staticBoard: StaticBoard
    public readonly visBoardPlate: VisBoardPlate
    public readonly visPiecesContainer: THREE.Group
    public readonly visBoardContainer: THREE.Group
    private readonly visPiecesById: Map<string, VisPiece>

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

        this.visPiecesById = new Map()
    }

    public getRootNode(): THREE.Object3D {
        return this.visBoardContainer
    }

    public addPiece(piece: Piece, boardPos: Vec2I): Anim {
        const visPiece = createVisPiece(piece, this.staticBoard)
        const pos = this.staticBoard.boardToWorldPos(boardPos)
        return {
            name: `Add piece at ${vec2i.toString(boardPos)}: ${visPiece.pieceData.type}`,
            duration: 0,
            start: () => this.addVisPiece(visPiece, pos),
        }
    }

    public removePiece(pieceId: string): SingleAnim {
        return {
            name: `Remove piece: ${pieceId}`,
            duration: 0,
            start: () => this.removeVisPieceById(pieceId),
        }
    }

    public movePiece(pieceId: string, fromBPos: Vec2I, toBPos: Vec2I): SingleAnim {
        const fromPos = this.staticBoard.boardToWorldPos(fromBPos)
        const toPos = this.staticBoard.boardToWorldPos(toBPos)
        return {
            name: `Move piece ${pieceId}: ${vec2i.toString(fromBPos)} to ${vec2i.toString(toBPos)}`,
            duration: 1,
            update: ({ durationRatio, durationRatioInv }) => {
                const fromPosRatio = fromPos.clone().multiplyScalar(durationRatioInv)
                const toPosRatio = toPos.clone().multiplyScalar(durationRatio)
                const intermediatePos = new THREE.Vector3().addVectors(fromPosRatio, toPosRatio)
                this.changeVisPiecePositionById(pieceId, intermediatePos)
            },
            end: () => this.changeVisPiecePositionById(pieceId, toPos),
        }
    }

    public getVisPieces(): VisPiece[] {
        return [...this.visPiecesById.values()]
    }
    //
    // public getPiecesCurrentWorldPosOfType<T extends Piece>(type: string): [T, THREE.Vector3][] {
    //     const allVisPieces = this.visBoardPieces.flat(3) as VisPiece[]
    //
    //     const visPiecesWithCurrentWorldPos = allVisPieces
    //         .filter((visPiece) => visPiece.pieceData.type === type)
    //         .map((visPiece) => [visPiece.pieceData as T, visPiece.pieceObject.position]) as [
    //         T,
    //         THREE.Vector3,
    //     ][]
    //     return visPiecesWithCurrentWorldPos
    // }

    private addVisPiece(visPiece: VisPiece, pos: THREE.Vector3) {
        const pieceObject = visPiece.pieceObject
        this.visPiecesById.set(visPiece.pieceData.id, visPiece)

        pieceObject.position.copy(pos)
        this.visPiecesContainer.add(visPiece.pieceObject)

        this.onVisPieceChange && this.onVisPieceChange("add", visPiece)
    }

    private changeVisPiecePositionById(pieceId: string, position: THREE.Vector3) {
        const visPiece = this.visPiecesById.get(pieceId)
        if (visPiece) {
            visPiece.pieceObject.position.copy(position)
            this.onVisPieceChange && this.onVisPieceChange("move", visPiece)
        }
    }

    private removeVisPieceById(pieceId: string) {
        const visPiece = this.visPiecesById.get(pieceId)
        if (visPiece) {
            this.visPiecesById.delete(pieceId)
            this.visPiecesContainer.remove(visPiece.pieceObject)

            this.onVisPieceChange && this.onVisPieceChange("remove", visPiece)
        }
    }
}
