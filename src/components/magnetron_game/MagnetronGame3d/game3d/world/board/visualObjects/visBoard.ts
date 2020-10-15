import { createStaticBoard, StaticBoard } from "../staticBoard"
import boardVisObject, { VisBoardPlate } from "./visBoardPlate"
import * as THREE from "three"
import { createVisPiece, VisPiece } from "./visPieces"
import { MagStaticState } from "../../../../../../../services/magnetronServerService/types/gameTypes/staticStateTypes"
import { Vec2I } from "../../../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { Piece } from "../../../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { Anim, SingleAnim } from "../../../animation_manager/animationTypes"
import * as vec2i from "../../../../../../../utils/vec2IUtils"
import { VisPieceChangeListener } from "./visBoardListener"
import transformPositionAnim from "../animations/transformPositionAnim"
import { Anims } from "../../../animation_manager/animationHelpers"

export class VisBoard {
    private readonly visBoardPlate: VisBoardPlate
    private readonly visPiecesContainer: THREE.Group
    private readonly visBoardContainer: THREE.Group
    private readonly visPiecesById: Map<string, VisPiece>

    public readonly staticBoard: StaticBoard

    public onVisPieceChange: VisPieceChangeListener | undefined = undefined

    constructor(staticState: MagStaticState) {
        this.staticBoard = createStaticBoard(staticState)
        this.visBoardPlate = boardVisObject(this.staticBoard)
        this.visPiecesContainer = new THREE.Group()
        this.visBoardContainer = new THREE.Group()

        this.visBoardContainer.add(this.visBoardPlate.object)
        this.visBoardContainer.add(this.visPiecesContainer)

        this.visPiecesById = new Map()
    }

    public getRootNode(): THREE.Group {
        return this.visBoardContainer
    }

    public getBoardPlate(): VisBoardPlate {
        return this.visBoardPlate
    }

    public addPiece(piece: Piece, boardPos: Vec2I): Anim {
        const visPiece = createVisPiece(piece, this.staticBoard)
        const pos = this.staticBoard.boardToWorldPos(boardPos)
        const addPieceAnim: SingleAnim = {
            name: `Add piece at ${vec2i.toString(boardPos)}: ${visPiece.pieceData.type}`,
            duration: 0,
            start: () => this.addVisPiece(visPiece, pos),
        }
        const descendFrom = pos.clone().setY(0.5)
        const descendAnim = transformPositionAnim(visPiece.pieceObject, descendFrom, pos, 0.2)
        return Anims.chained([addPieceAnim, descendAnim])
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
