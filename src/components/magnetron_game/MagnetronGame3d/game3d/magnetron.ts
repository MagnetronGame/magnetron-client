import * as THREE from "three"
import { Entity } from "./Entity"
import { Anim } from "./animation/animationTypes"
import { Anims } from "./animation/animationHelpers"
import * as vec2i from "../../../../utils/vec2IUtils"
import AnimationManager from "./animation/AnimationManager"
import magnetAffectAnim from "./magnetAffectAnim"
import { VisAvatarHeight } from "./board/visualObjects/visPieces"
import {
    AvatarPiece,
    MagnetPiece,
} from "../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import {
    MagnetType,
    MagState,
    Vec2I,
} from "../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import World from "./world/World"
import constructWorldAnim from "./world/constructWorldAnim"
import { updateState } from "./state_manager/stateUpdate"

export class Magnetron {
    started = false

    rootElement: HTMLElement
    elementWidth: number
    elementHeight: number

    world: World
    prevGameState: MagState | null = null

    private entities: Entity[] = []
    private animManager: AnimationManager

    private prevTimeMillis = 0

    public onAvatarsScreenPositionChange:
        | ((avatar: AvatarPiece, avatarPositions: Vec2I) => void)
        | undefined = undefined

    public onGameEnd: (() => void) | undefined = undefined

    constructor(rootElem: HTMLElement, initialState: MagState) {
        this.rootElement = rootElem
        this.elementWidth = this.rootElement.clientWidth
        this.elementHeight = this.rootElement.clientHeight

        this.world = new World(initialState.staticState, this.elementWidth, this.elementHeight)
        this.rootElement.appendChild(this.world.getRenderer().domElement)

        this.animManager = new AnimationManager()
        this.animManager.logging = false
        this.animManager.start()

        this.animManager.add(constructWorldAnim(this.world))

        this.prevTimeMillis = performance.now()
        requestAnimationFrame(this.update)
    }

    public end() {
        this.animManager.end()
    }

    private createWorld(state: MagState) {
        // this.board.onVisPieceChange = (type, visPiece) => {
        //     if (visPiece.pieceData.type === "AvatarPiece") {
        //         const avatar = visPiece.pieceData
        //         const avatarIndex = avatar.index
        //         const screenPosition = this.getAvatarsScreenPosition()[avatarIndex]
        //         this.onAvatarsScreenPositionChange &&
        //             this.onAvatarsScreenPositionChange(avatar, screenPosition)
        //     }
        // }
    }

    private getMagnetNeighbours(boardPos: Vec2I): [MagnetPiece, Vec2I][] {
        const neighbourPositions = [
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ]
            .map((relNPos) => vec2i.add(boardPos, relNPos))
            .filter((bPos) => this.board!.isPositionInsideBoard(bPos))
        const nMagnetsWithPos = neighbourPositions
            .map((bpos) => [this.board!.getPieceOfType(bpos, "MagnetPiece"), bpos])
            .filter(([magnet, _]) => !!magnet) as [MagnetPiece, Vec2I][]

        return nMagnetsWithPos
    }

    private createNeighbourMagnetsEffect(avatar: AvatarPiece, boardPos: Vec2I): Anim {
        const anims = this.getMagnetNeighbours(boardPos)
            .filter(
                ([piece, _]) =>
                    piece.magnetType === MagnetType.POSITIVE ||
                    piece.magnetType === MagnetType.NEGATIVE,
            )
            .map(([piece, bpos]) => {
                const color = MagnetColorByType[piece.magnetType].lighter
                const towardsAvatar = avatar.magnetType !== piece.magnetType
                const aboveGroundVec = new THREE.Vector3(0, 0.05, 0)
                return magnetAffectAnim(
                    this.scene,
                    this.board!.boardPosToWorldPos(boardPos).add(aboveGroundVec),
                    this.board!.boardPosToWorldPos(bpos).add(aboveGroundVec),
                    towardsAvatar,
                    this.board!.staticBoard.cellSize.x,
                    this.board!.staticBoard.cellSize.y,
                    color,
                )
            })
        return Anims.parallel(anims)
    }

    public updateState(state: MagState) {
        const stateUpdateAnim = updateState(state, this.prevGameState, this.world)
        this.animManager.add(stateUpdateAnim)

        if (state.lifecycleState.isTerminal) {
            this.animManager.add({
                duration: 0,
                start: () => this.onGameEnd && this.onGameEnd(),
            })
        }
    }

    private update = (timeMillis: number = 0) => {
        requestAnimationFrame(this.update)
        const deltaTimeMillis = Math.max(timeMillis - this.prevTimeMillis, 0)
        this.prevTimeMillis = timeMillis
        const deltaTimeSecs = deltaTimeMillis * 0.001

        this.animManager.update(deltaTimeSecs)

        this.resizeToDisplaySize(this.world)
        this.world.render()
    }

    private resizeToDisplaySize(world: World) {
        if (this.resizeRendererToDisplaySize(world.renderer)) {
            const canvas = world.renderer.domElement
            world.camera.aspect = canvas.clientWidth / canvas.clientHeight
            world.camera.updateProjectionMatrix()
        }
    }

    private resizeRendererToDisplaySize(renderer: THREE.Renderer): boolean {
        const canvas = renderer.domElement
        const width = this.rootElement.clientWidth
        const height = this.rootElement.clientHeight
        const needResize = canvas.width !== width || canvas.height !== height
        if (needResize) {
            renderer.setSize(width, height, false)
        }
        return needResize
    }
}
