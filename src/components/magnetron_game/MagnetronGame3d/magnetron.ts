import * as THREE from "three"
import { Board } from "./board"
import { Entity } from "./Entity"
import {
    Avatar,
    MagnetPiece,
    MagState,
    Piece,
    Vec2I,
} from "../../../services/magnetronServerService/magnetronGameTypes"
import { InlineAnimation } from "./animation/InlineAnimation"
import { ChainedAnimations } from "./animation/chainedAnimations"
import { Anim, ChainedAnims } from "./animation/animationTypes"
import cameraZoomRotateAnim from "./cameraZoomRotateAnim"
import { Anims, Duration } from "./animation/animationHelpers"
import cameraMovementAnim from "./cameraMovementAnim"
import * as vec2i from "../../../utils/vec2IUtils"
import AnimationManager from "./animation/AnimationManager"

export class Magnetron {
    started = false

    rootElement: HTMLElement
    elementWidth: number
    elementHeight: number
    camera: THREE.PerspectiveCamera
    scene: THREE.Scene
    renderer: THREE.Renderer

    board: Board | null = null

    private entities: Entity[] = []
    private animManager: AnimationManager

    private prevTimeMillis = 0

    constructor(rootElem: HTMLElement) {
        this.rootElement = rootElem
        this.elementWidth = this.rootElement.clientWidth
        this.elementHeight = this.rootElement.clientHeight

        const camera = new THREE.PerspectiveCamera(
            70,
            this.elementWidth / this.elementHeight,
            0.01,
            10,
        )
        this.camera = camera

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xbceef5)

        const renderer = new THREE.WebGLRenderer({ antialias: true })

        renderer.setSize(this.elementWidth, this.elementHeight, false)
        renderer.domElement.width = this.elementWidth
        renderer.domElement.height = this.elementHeight

        this.rootElement.appendChild(renderer.domElement)

        this.scene = scene
        this.renderer = renderer

        this.animManager = new AnimationManager()
        this.animManager.logging = true
        this.addEntity(this.animManager.entity)
    }

    public addEntity(entity: Entity) {
        this.entities.push(entity)
        if (this.started) {
            entity.internalStart(this)
        }
    }

    private createWorld(state: MagState) {
        // this.addEntity(new CameraOrbitControls())

        const lightColor = 0xffffff
        const lightIntensity = 0.9
        const light = new THREE.DirectionalLight(lightColor, lightIntensity)
        light.position.set(-1, 2, 1)
        this.scene.add(light)

        this.animManager.add({
            name: "top light movement",
            context: "main-parallel",
            duration: Duration.INF,
            update: ({ currDuration }) => {
                light.position.set(Math.cos(currDuration) * 3, 10, Math.sin(currDuration) * 3)
            },
        })

        const frontLightColor = 0xffffff
        const frontLightIntensity = 0.3
        const frontLight = new THREE.DirectionalLight(frontLightColor, frontLightIntensity)
        frontLight.position.set(0, 0, 10)
        this.scene.add(frontLight)

        this.board = new Board(state, this.pieceEquals)
        this.scene.add(this.board.visBoardContainer)

        this.animManager.add(
            Anims.chained([
                Anims.parallel(
                    [
                        this.board.getCreationAnimation(),
                        cameraZoomRotateAnim(this.camera, 2, 0.6, -Math.PI / 2, 1, 5),
                    ],
                    "Create board and initial camera motion",
                ),
                cameraMovementAnim(this.camera),
            ]),
        )

        this.updateState(state)
    }

    public startAndLoop(state: MagState) {
        this.start(state)
        requestAnimationFrame(this.update)
    }

    private pieceEquals = (piece: Piece, other: Piece): boolean => {
        if (piece.type !== other.type) {
            return false
        }
        switch (piece.type) {
            case "Avatar":
                return (piece as Avatar).index === (other as Avatar).index
            case "MagnetPiece":
                return (piece as MagnetPiece).magnetType === (other as MagnetPiece).magnetType
            case "CoinPiece":
            case "EmptyPiece":
                return true
            default:
                return false
        }
    }

    private setState(state: MagState): ChainedAnims {
        const piecesChangeAnims: ChainedAnims = Anims.chained(
            state.board.flatMap((boardRow, y) =>
                boardRow
                    .map<[Piece, Vec2I]>((piece, x) => [piece, { x, y }])
                    .filter(([piece, boardPos]) => !this.board!.hasOnlyPiece(boardPos, piece))
                    .map(([piece, boardPos]) =>
                        Anims.chained(
                            [
                                this.board!.getPieces(boardPos).length !== 0
                                    ? this.board!.removePieces(boardPos, "Avatar", true)
                                    : null,
                                piece.type !== "EmptyPiece"
                                    ? this.board!.addPiece(piece, boardPos, true)
                                    : null,
                            ].filter((anim) => anim !== null) as Anim[],
                            "Change single piece",
                        ),
                    )
                    .filter((anim) => anim.anims.length !== 0),
            ),
            "Change pieces",
        )

        const boardAvatarPiecesWithPos = this.board!.getPiecesWithPosOfType("Avatar") as [
            Avatar,
            Vec2I,
        ][]
        const boardAvatarPieces = boardAvatarPiecesWithPos.map(([_a, _]) => _a)

        const anyAvatarEquals = (a1: Avatar, others: Avatar[]) =>
            others.some((_a) => this.pieceEquals(_a, a1))

        const nonExistingAvatarPiecesWithPos = state.avatars
            .map<[Avatar, Vec2I]>((_avatar, index) => [_avatar, state.avatarsBoardPosition[index]])
            .filter(([_avatar, _]) => !anyAvatarEquals(_avatar, boardAvatarPieces))

        const existingAvatarPiecesWithOldPos = boardAvatarPiecesWithPos.filter(([_avatar, _]) =>
            anyAvatarEquals(_avatar, state.avatars),
        )

        const existingAvatarPiecesWithNewOldPos = existingAvatarPiecesWithOldPos.map<
            [Avatar, Vec2I, Vec2I]
        >(([existingAvatar, oldPos]) => {
            const newAvatarIndex = state.avatars.findIndex((newAvatar) =>
                this.pieceEquals(existingAvatar, newAvatar),
            )
            if (newAvatarIndex !== -1) {
                const newPos = state.avatarsBoardPosition[newAvatarIndex]
                return [existingAvatar, newPos, oldPos]
            } else throw Error(`Could not find avatar: ${existingAvatar.index}`)
        })

        const createAvatarsAnimations: ChainedAnims = Anims.chained(
            nonExistingAvatarPiecesWithPos.map(([avatar, boardPos]) =>
                this.board!.addPiece(avatar, boardPos),
            ),
            "Create avatars",
        )

        const moveAvatarsAnims: ChainedAnims = Anims.chained(
            existingAvatarPiecesWithNewOldPos
                .filter(([, newBoardPos, oldBoardPos]) => !vec2i.equals(newBoardPos, oldBoardPos))
                .map(([avatar, newBoardPos, oldBoardPos]) =>
                    Anims.chained([
                        { duration: 0.5 },
                        this.board!.movePiece(avatar, oldBoardPos, newBoardPos),
                        { duration: 0.5 },
                    ]),
                ),
            "Move avatars",
        )

        const stateUpdateAnims = Anims.chained(
            [createAvatarsAnimations, moveAvatarsAnims, piecesChangeAnims].filter(
                (anim) => anim.anims.length !== 0,
            ),
            "State update anims",
        )
        return stateUpdateAnims
    }

    public updateState(state: MagState) {
        if (state.didSimulate) {
            const simAnims = Anims.chained(
                state.simulationStates.map((simState) => this.setState(simState)),
                "simulation",
            )
            this.animManager.add(Anims.chained([{ duration: 3 }, simAnims, { duration: 3 }], ""))
        }
        this.animManager.add(this.setState(state))
    }

    private start(state: MagState) {
        this.prevTimeMillis = performance.now()
        this.camera.position.set(0.5, 1, 0.5)
        this.camera.lookAt(0, 0, 0)
        this.createWorld(state)
        this.entities.forEach((entity) => entity.internalStart(this))
        this.started = true
    }

    private update = (timeMillis: number = 0) => {
        requestAnimationFrame(this.update)
        const deltaTimeMillis = Math.max(timeMillis - this.prevTimeMillis, 0)
        this.prevTimeMillis = timeMillis
        const deltaTimeSecs = deltaTimeMillis * 0.001

        const removeEntities = this.entities.filter((entity) => {
            entity.internalUpdate(this, deltaTimeSecs)
            return entity.shouldRemove
        })
        if (removeEntities.length > 0) {
            removeEntities.forEach((entity) => entity.internalEnd(this))
            this.entities = this.entities.filter((entity) => !removeEntities.includes(entity))
        }

        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight
            this.camera.updateProjectionMatrix()
        }

        this.renderer.render(this.scene, this.camera)
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
