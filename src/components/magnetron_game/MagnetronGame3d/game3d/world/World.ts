import * as THREE from "three"
import { AudioManager } from "./asset_managers/AudioManager"
import { VisBoard } from "./board/visualObjects/visBoard"
import { MagStaticState } from "../../../../../services/magnetronServerService/types/gameTypes/staticStateTypes"
import WorldTransforms from "./WorldTransforms"
import WorldListeners from "./WorldListeners"
import { Vec2I } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"

export default class World {
    public readonly camera: THREE.PerspectiveCamera
    public readonly scene: THREE.Scene
    public readonly renderer: THREE.Renderer
    public readonly audioManager: AudioManager
    public readonly visBoard: VisBoard

    public readonly transforms = new WorldTransforms(this)
    public readonly listeners = new WorldListeners(this)

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

    public getDomNode(): HTMLElement {
        return this.renderer.domElement
    }

    public render() {
        this.renderer.render(this.scene, this.camera)
    }

    public resizeView(size: Vec2I, prevSize?: Vec2I) {
        const newAspect = size.x / size.y
        if (prevSize) {
            const prevAspect = prevSize.x / prevSize.y
            if (newAspect !== prevAspect) {
                this.updateCameraAspect(newAspect)
            }
        } else {
            this.updateCameraAspect(newAspect)
        }

        this.renderer.setSize(size.x, size.y, false)
    }

    private updateCameraAspect(aspect: number) {
        this.camera.aspect = aspect
        this.camera.updateProjectionMatrix()
    }
}
