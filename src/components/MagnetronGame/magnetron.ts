import * as THREE from "three"
import { Board } from "./board"
import { Entity } from "./Entity"
import { MagState } from "../../services/magnetronGameTypes"
import CameraOrbitControls from "./cameraOrbitControls"
import { CameraMovement } from "./cameraMovement"
import { CameraZoomRotate } from "./CameraZoomRotate"
import { Animation } from "./animation"
import { InlineAnimation, InlineAnimationType } from "./InlineAnimation"

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

        this.addEntity(
            new InlineAnimation({
                looping: true,
                update: (game: Magnetron, deltaTime: number, currDuration) => {
                    light.position.set(Math.cos(currDuration) * 3, 10, Math.sin(currDuration) * 3)
                },
            }),
        )

        const frontLightColor = 0xffffff
        const frontLightIntensity = 0.3
        const frontLight = new THREE.DirectionalLight(frontLightColor, frontLightIntensity)
        frontLight.position.set(0, 0, 10)
        this.scene.add(frontLight)

        this.board = new Board(state)
        this.scene.add(this.board.visBoardContainer)

        this.setState(state)

        this.addEntity(
            new CameraZoomRotate(2, 0.6, -Math.PI / 2, 1, 5).thenPlay(new CameraMovement()),
        )

        this.addEntity(this.board.getCreationAnimation())
    }

    public startAndLoop(state: MagState) {
        this.start(state)
        requestAnimationFrame(this.update)
    }

    public setState(state: MagState) {
        state.board.forEach((boardRow, y) =>
            boardRow.forEach((piece, x) => {
                const pos = { x, y }
                this.board!.putPiece(piece, pos)
            }),
        )

        state.avatars.forEach((avatar, index) => {
            const boardPos = state.avatarsBoardPosition[index]
            this.board!.putPiece(avatar, boardPos)
        })

        // transition avatars
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
