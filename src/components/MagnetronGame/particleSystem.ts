import * as THREE from "three"
import { Animation } from "./animation"
import { Magnetron } from "./magnetron"

export class ParticleSystem extends Animation {
    private particleCount = 1800
    private particlesGeom = new THREE.Geometry()
    private material: THREE.Material
    private particlesWrapper: THREE.Object3D = new THREE.Object3D()
    private position: THREE.Vector3
    private distanceSpeedFactor: number

    constructor(
        duration: number,
        position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
        color: THREE.Color | string | number,
        size: number = 0.05,
        distanceSpeedFactor: number = 0.001,
    ) {
        super(duration, false)
        this.position = position

        this.material = new THREE.PointsMaterial({
            color: color,
            size: size,
        })
        this.distanceSpeedFactor = distanceSpeedFactor
    }

    start(game: Magnetron) {
        // create the particle variables

        // now create the individual particles
        for (var p = 0; p < this.particleCount; p++) {
            // create a particle with random
            // position values, -250 -> 250
            var pX = Math.random() * 1 - 0.5,
                pY = Math.random() * 1 - 0.5,
                pZ = Math.random() * 1 - 0.5,
                particle = new THREE.Vector3(pX, pY, pZ)

            // add it to the geometry
            this.particlesGeom.vertices.push(particle)
        }

        // create the particle system
        const particles = new THREE.Points(this.particlesGeom, this.material) //new THREE.ParticleSystem(particles, pMaterial)
        this.particlesWrapper.add(particles)
        this.particlesWrapper.position.copy(this.position)
        game.scene.add(this.particlesWrapper)
    }

    update(magnetron: Magnetron, deltaTime: number) {
        this.particlesGeom.vertices.forEach((particle) => {
            const distortMax = 0.01
            const distort = new THREE.Vector3(
                (Math.random() * 2 - 1) * distortMax,
                (Math.random() * 2 - 1) * distortMax,
                (Math.random() * 2 - 1) * distortMax,
            )
            const fromCenter = particle.clone().add(this.position)
            const move = distort.add(fromCenter.multiplyScalar(this.distanceSpeedFactor))
            particle.add(move)
        })
        this.particlesGeom.verticesNeedUpdate = true
    }

    protected end(game: Magnetron): void {
        game.scene.remove(this.particlesWrapper)
    }
}
