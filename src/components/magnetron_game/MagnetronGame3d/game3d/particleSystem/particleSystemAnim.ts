import * as THREE from "three"
import { AnimUpdateProps, SingleAnim } from "../animation/animationTypes"
import { ParticleSystemConfig, ParticleSystemConfigAbsolute } from "./particleSystemTypes"
import {
    insertDefaultConfigValues,
    PI_2,
    randomUnitVector3,
    randRange,
    RIGHT_VEC,
    ZERO_VEC,
} from "./particleSystemUtils"
import { range } from "../../../../utils/arrayUtils"

export default class ParticleSystemAnim implements SingleAnim {
    duration: number
    parentObject: THREE.Object3D
    private config: ParticleSystemConfigAbsolute

    private particlesGeom = new THREE.Geometry()
    private material: THREE.Material
    private particlesWrapper: THREE.Object3D = new THREE.Object3D()

    constructor(parentObject: THREE.Object3D, duration: number, config: ParticleSystemConfig) {
        this.duration = duration
        this.parentObject = parentObject
        const configWithDefaults = insertDefaultConfigValues(config)
        const processedConfig = {
            ...configWithDefaults,
            direction: configWithDefaults.direction.normalize(),
        }
        this.config = processedConfig

        this.material = new THREE.PointsMaterial({
            color: this.config.color,
            size: Math.max(this.config.particleSizeMin, this.config.particleSizeMax),
            // blending: THREE.AdditiveBlending,
        })
    }

    private getRandomPosition(): THREE.Vector3 {
        if (this.config.formation.formation === "circle") {
            // direction is normalized
            const somePerpendicularVec = this.config.direction.clone().cross(RIGHT_VEC)
            const randomPerpendicularVec = somePerpendicularVec.applyAxisAngle(
                this.config.direction,
                PI_2 * Math.random(),
            )
            const pos = randomPerpendicularVec.multiplyScalar(
                randRange(this.config.formation.radiusInner, this.config.formation.radiusOuter),
            )
            return pos
        } else if (this.config.formation.formation === "sphere") {
            // direction is normalized
            const randomUnitVec = randomUnitVector3()
            const pos = randomUnitVec.multiplyScalar(
                randRange(this.config.formation.radiusInner, this.config.formation.radiusOuter),
            )
            return pos
        } else {
            const widthInnerHalf = this.config.formation.widthInner / 2
            const widthOuterHalf = this.config.formation.widthOuter / 2
            const heightInnerHalf = this.config.formation.heightInner / 2
            const heightOuterHalf = this.config.formation.heightOuter / 2
            const fixedAxisX = Math.random() < 0.5
            if (fixedAxisX) {
                const xPositive = randRange(widthInnerHalf, widthOuterHalf)
                const x = Math.random() < 0.5 ? -xPositive : xPositive
                const y = randRange(-heightOuterHalf, heightOuterHalf)
                return new THREE.Vector3(x, 0, y)
            } else {
                const yPositive = randRange(heightInnerHalf, heightOuterHalf)
                const y = Math.random() < 0.5 ? -yPositive : yPositive
                const x = randRange(-widthOuterHalf, widthOuterHalf)
                return new THREE.Vector3(x, 0, y)
            }
            // TODO: rectangle formation will not rotate
        }
    }

    start() {
        for (let p = 0; p < this.config.particleCount; p++) {
            const particlePos = this.getRandomPosition()
            this.particlesGeom.vertices.push(particlePos)
        }

        const particles = new THREE.Points(this.particlesGeom, this.material)
        this.particlesWrapper.add(particles)
        this.particlesWrapper.position.copy(this.config.centerPosition)
        this.parentObject.add(this.particlesWrapper)
    }

    update({ deltaTime }: AnimUpdateProps) {
        this.particlesGeom.vertices.forEach((particlePos) => {
            const distort = this.config.particlePositionDistortMax
                ? randomUnitVector3().multiplyScalar(
                      randRange(
                          this.config.particlePositionDistortMin,
                          this.config.particlePositionDistortMax,
                      ),
                  )
                : ZERO_VEC
            const distanceSpeedVelocity = this.config.distanceSpeedFactor
                ? particlePos.clone().multiplyScalar(this.config.distanceSpeedFactor)
                : ZERO_VEC
            const directionVelocity = this.config.particleSpeedMax
                ? this.config.direction
                      .clone()
                      .multiplyScalar(
                          randRange(this.config.particleSpeedMin, this.config.particleSpeedMax),
                      )
                      .add(
                          randomUnitVector3().multiplyScalar(
                              randRange(0, this.config.particleSpread),
                          ),
                      )
                : ZERO_VEC
            const totalVelocity = new THREE.Vector3()
                .add(distort)
                .add(distanceSpeedVelocity)
                .add(directionVelocity)
            const totalVelocityTimeScaled = totalVelocity.multiplyScalar(deltaTime)
            particlePos.add(totalVelocityTimeScaled)
        })
        this.particlesGeom.verticesNeedUpdate = true
    }

    end(): void {
        this.parentObject.remove(this.particlesWrapper)
    }
}
