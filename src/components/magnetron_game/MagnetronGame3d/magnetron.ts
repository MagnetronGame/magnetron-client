import * as THREE from "three"
import { Board } from "./board"
import { Entity } from "./Entity"
import {
    Avatar,
    MagnetPiece,
    MagnetType,
    MagState,
    Piece,
    Vec2I,
} from "../../../services/magnetronServerService/magnetronGameTypes"
import { Anim, ChainedAnims } from "./animation/animationTypes"
import cameraZoomRotateAnim from "./cameraZoomRotateAnim"
import { Anims, Duration } from "./animation/animationHelpers"
import cameraMovementAnim from "./cameraMovementAnim"
import * as vec2i from "../../../utils/vec2IUtils"
import AnimationManager from "./animation/AnimationManager"
import boardSparksAnimation from "./boardSparksAnimation"
import magnetAffectAnim from "./magnetAffectAnim"
import { MagnetColorByType } from "../../../MagnetronTheme"
import ShakeAnimation from "./ShakeAnimation"
import sceneBackgroundFadeAnim from "./sceneBackgroundFadeAnim"
import { AudioManager, MagAudio } from "./AudioManager"
import { VisAvatarHeight } from "./visPieces"

export class Magnetron {
    started = false

    rootElement: HTMLElement
    elementWidth: number
    elementHeight: number
    camera: THREE.PerspectiveCamera
    scene: THREE.Scene
    renderer: THREE.Renderer
    audioListener: THREE.AudioListener

    board: Board | null = null
    audioManager: AudioManager

    private entities: Entity[] = []
    private animManager: AnimationManager

    private prevTimeMillis = 0

    public onAvatarsScreenPositionChange:
        | ((avatar: Avatar, avatarPositions: Vec2I) => void)
        | undefined = undefined

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

        this.audioListener = new THREE.AudioListener()
        camera.add(this.audioListener)

        this.audioManager = new AudioManager(this.audioListener)

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
        this.animManager.logging = false
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

        this.board.onVisPieceChange = (type, visPiece) => {
            if (visPiece.type === "Avatar") {
                const avatar = visPiece.pieceData as Avatar
                const avatarIndex = avatar.index
                const screenPosition = this.getAvatarsScreenPosition()[avatarIndex]
                this.onAvatarsScreenPositionChange &&
                    this.onAvatarsScreenPositionChange(avatar, screenPosition)
            }
        }

        this.animManager.add(
            Anims.chained([
                Anims.parallel(
                    [
                        {
                            duration: 0,
                            start: () =>
                                this.audioManager.playAudio(MagAudio.BACKGROUND, 0.5, true),
                        },
                        this.board.getCreationAnimation(),
                        cameraZoomRotateAnim(this.camera, 5, 0.6, -Math.PI / 2, 1, 7),
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

    private worldToScreenPos = (position: THREE.Vector3, camera: THREE.Camera): Vec2I => {
        // obj.updateMatrixWorld()
        const _position = position.clone()
        _position.project(camera)
        const width = this.renderer.domElement.width
        const height = this.renderer.domElement.height
        return {
            x: ((_position.x + 1) * width) / 2,
            y: (-(_position.y - 1) * height) / 2,
        }
    }

    public getAvatarsScreenPosition = (): Vec2I[] => {
        if (this.board) {
            return this.board
                .getPiecesCurrentWorldPosOfType<Avatar>("Avatar")
                .sort(([a1], [a2]) => a1.index - a2.index)
                .map(([, worldPos]) =>
                    worldPos.clone().add(new THREE.Vector3(0, VisAvatarHeight, 0)),
                )
                .map((worldPos) => this.worldToScreenPos(worldPos, this.camera))
        } else return []
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

    private createNeighbourMagnetsEffect(boardPos: Vec2I, avatar: Avatar): Anim {
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

        const boardAvatarPiecesWithPos = this.board!.getPiecesWithPosOfType<Avatar>("Avatar").sort(
            ([a1], [a2]) => a1.index - a2.index,
        )

        const boardAvatarPieces = boardAvatarPiecesWithPos.map(([_a, _]) => _a)

        const anyAvatarEquals = (a1: Avatar, others: Avatar[]) =>
            others.some((_a) => this.pieceEquals(_a, a1))

        const newAvatarPiecesWithPos = state.avatars
            .map<[Avatar, Vec2I]>((_avatar, index) => [_avatar, state.avatarsBoardPosition[index]])
            .filter(([_avatar, _]) => !anyAvatarEquals(_avatar, boardAvatarPieces))

        const existingAvatarPiecesWithOldPos = boardAvatarPiecesWithPos.filter(([_avatar, _]) =>
            anyAvatarEquals(_avatar, state.avatars),
        )

        const existingAvatarPiecesWithNewOldPos = existingAvatarPiecesWithOldPos.map<
            [Avatar, Vec2I, Vec2I]
        >(([existingAvatar, oldPos], avatarIndex) => {
            const newPos = state.avatarsBoardPosition[avatarIndex]
            return [existingAvatar, newPos, oldPos]
        })

        const newAvatarsAnimations: ChainedAnims = Anims.chained(
            newAvatarPiecesWithPos.map(([avatar, boardPos]) =>
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
                        this.createNeighbourMagnetsEffect(oldBoardPos, avatar),
                        this.board!.movePiece(avatar, oldBoardPos, newBoardPos),
                        { duration: 0.5 },
                    ]),
                ),
            "Move avatars",
        )

        const stateUpdateAnims = Anims.chained(
            [newAvatarsAnimations, moveAvatarsAnims, piecesChangeAnims].filter(
                (anim) => anim.anims.length !== 0,
            ),
            "State update anims",
        )
        return stateUpdateAnims
    }

    public updateState(state: MagState) {
        if (state.didSimulate) {
            const simAnims = state.simulationStates.map((simState) => this.setState(simState))
            const [lastPieceStateAnim, ...restSimAnims] = simAnims
            const standardSceneBackground = (this.scene.background as THREE.Color).clone()
            const simulateSceneBackground = new THREE.Color("#011333") // new THREE.Color("#070b40")
            this.animManager.add(
                Anims.chained(
                    [
                        {
                            duration: 0,
                            start: () => {
                                this.audioManager.stopAudio(MagAudio.BACKGROUND)
                                this.audioManager.playAudio(
                                    MagAudio.BACKGROUND_SIMULATION,
                                    0.8,
                                    true,
                                )
                            },
                        },
                        { duration: 2 },
                        sceneBackgroundFadeAnim(this.scene, simulateSceneBackground, 0.5),
                        Anims.parallel([
                            new ShakeAnimation(this.board!.visBoardContainer, 0.4, 0.1),
                            boardSparksAnimation(this.scene, this.board!, standardSceneBackground),
                        ]),
                        lastPieceStateAnim,
                        { duration: 5 },
                        Anims.chained(restSimAnims),
                        { duration: 2 },
                        sceneBackgroundFadeAnim(this.scene, standardSceneBackground, 0.2),
                        {
                            duration: 0,
                            start: () => {
                                this.audioManager.stopAudio(MagAudio.BACKGROUND_SIMULATION)
                                this.audioManager.playAudio(MagAudio.BACKGROUND, 0.5, true)
                            },
                        },
                    ],
                    "",
                ),
            )
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
