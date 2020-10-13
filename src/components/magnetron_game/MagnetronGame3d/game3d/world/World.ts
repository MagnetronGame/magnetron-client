import * as THREE from "three"
import { Vec2I } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { AudioManager } from "../AudioManager"
import { AvatarPiece } from "../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { VisBoard } from "../board/visualObjects/visBoard"
import { MagStaticState } from "../../../../../services/magnetronServerService/types/gameTypes/staticStateTypes"

export default class World {
    readonly camera: THREE.PerspectiveCamera
    readonly scene: THREE.Scene
    readonly renderer: THREE.Renderer
    readonly audioManager: AudioManager
    readonly visBoard: VisBoard

    public onAvatarsScreenPositionChange:
        | ((avatar: AvatarPiece, avatarPositions: Vec2I) => void)
        | undefined = undefined

    constructor(magStaticState: MagStaticState, width: number, height: number) {
        this.camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10)

        const audioListener = new THREE.AudioListener()
        this.camera.add(audioListener)
        this.audioManager = new AudioManager(audioListener)

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xbceef5)

        this.renderer = new THREE.WebGLRenderer({ antialias: true })

        this.renderer.setSize(width, height, false)
        this.renderer.domElement.width = width
        this.renderer.domElement.height = height

        this.visBoard = new VisBoard(magStaticState)
        this.scene.add(this.visBoard.getRootNode())
    }

    public getRenderer(): THREE.Renderer {
        return this.renderer
    }

    public render() {
        this.renderer.render(this.scene, this.camera)
    }
    public worldToScreenPos = (position: THREE.Vector3): Vec2I => {
        // obj.updateMatrixWorld()
        const _position = position.clone()
        _position.project(this.camera)
        const width = this.renderer.domElement.width
        const height = this.renderer.domElement.height
        return {
            x: ((_position.x + 1) * width) / 2,
            y: (-(_position.y - 1) * height) / 2,
        }
    }
}
