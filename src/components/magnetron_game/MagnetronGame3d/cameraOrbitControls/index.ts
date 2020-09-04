import { Animation } from "../animation"
import { Magnetron } from "../magnetron"
import { OrbitControls } from "@kibou/three-orbitcontrols-ts"

export default class CameraOrbitControls extends Animation {
    private orbitControls: any | null = null

    constructor() {
        super(-1, true)
    }

    protected start(game: Magnetron): void {
        this.orbitControls = new OrbitControls(game.camera, game.renderer.domElement)

        // this.orbitControls.autoRotate = true

        // How far you can orbit vertically, upper and lower limits.
        this.orbitControls.minPolarAngle = 0
        this.orbitControls.maxPolarAngle = Math.PI // / 2

        // How far you can dolly in and out ( PerspectiveCamera only )
        this.orbitControls.minDistance = 0.5
        this.orbitControls.maxDistance = 6

        this.orbitControls.enableZoom = true // Set to false to disable zooming
        this.orbitControls.zoomSpeed = 1.0

        this.orbitControls.enablePan = false // Set to false to disable panning (ie vertical and horizontal translations)

        this.orbitControls.enableDamping = true // Set to false to disable damping (ie inertia)
        this.orbitControls.dampingFactor = 0.2 // 0.25

        this.orbitControls.dollyOut(1)
    }

    protected end(game: Magnetron): void {}

    protected update(game: Magnetron, deltaTime: number): void {
        if (this.orbitControls) {
            this.orbitControls.update()
        }
    }
}
