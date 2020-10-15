import { OrbitControls } from "@kibou/three-orbitcontrols-ts"
import { SingleAnim } from "../animation_manager/animationTypes"
import * as THREE from "three"
import { Duration } from "../animation_manager/animationHelpers"

export default (camera: THREE.Camera, renderer: THREE.Renderer): SingleAnim => {
    let orbitControls: OrbitControls | null = null

    return {
        duration: Duration.INF,
        context: "main-parallel",

        start: () => {
            orbitControls = new OrbitControls(camera, renderer.domElement)
            // this.orbitControls.autoRotate = true

            // How far you can orbit vertically, upper and lower limits.
            orbitControls.minPolarAngle = 0
            orbitControls.maxPolarAngle = Math.PI // / 2

            // How far you can dolly in and out ( PerspectiveCamera only )
            orbitControls.minDistance = 0.5
            orbitControls.maxDistance = 6

            orbitControls.enableZoom = true // Set to false to disable zooming
            orbitControls.zoomSpeed = 1.0

            orbitControls.enablePan = false // Set to false to disable panning (ie vertical and horizontal translations)

            orbitControls.enableDamping = true // Set to false to disable damping (ie inertia)
            orbitControls.dampingFactor = 0.2 // 0.25

            orbitControls.dollyOut(1)
        },
        update: () => {
            if (orbitControls) {
                orbitControls.update()
            }
        },
    }
}
