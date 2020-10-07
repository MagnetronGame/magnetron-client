import * as THREE from "three"
import {
    Distribution,
    ParticleSystemConfig,
    ParticleSystemConfigAbsolute,
} from "./particleSystemTypes"

export const ZERO_VEC = new THREE.Vector3()
export const RIGHT_VEC = new THREE.Vector3(1, 0, 0)
export const UP_VEC = new THREE.Vector3(0, 1, 0)
export const PI = Math.PI
export const PI_2 = PI * 2

export const randRange = (min: number, max: number) => Math.random() * (max - min) + min

export const randomUnitVector3 = (): THREE.Vector3 => {
    const randomVec = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
    )
    if (randomVec.lengthSq() === 0) {
        return randomUnitVector3()
    } else {
        return randomVec.normalize()
    }
}

export const defaultParticleConfigValues: ParticleSystemConfigAbsolute = {
    centerPosition: new THREE.Vector3(0, 0, 0),
    formation: { formation: "circle", radiusInner: 1, radiusOuter: 2 },
    direction: UP_VEC,
    particleLifetime: ["u", 0, 1],
    particleCreationTime: ["u", 0, 1],
    particleSpeedMin: 0,
    particleSpeedMax: 0,
    particleSpread: 0,
    distanceSpeedFactor: 0,
    particlePositionDistortMax: 0,
    particlePositionDistortMin: 0,
    color: "#000000",
    particleSizeMin: 0,
    particleSizeMax: 0,
    particleCount: 10,
}

export const insertDefaultConfigValues = (
    config: ParticleSystemConfig,
): ParticleSystemConfigAbsolute => {
    const configWithDefaultsEntries = Object.keys(defaultParticleConfigValues).map((key) => {
        const configKey = key as keyof ParticleSystemConfigAbsolute
        const value =
            config[configKey] === undefined
                ? defaultParticleConfigValues[configKey]
                : config[configKey]
        return [configKey, value]
    })
    return Object.fromEntries(configWithDefaultsEntries)
}

export const sample = (dist: Distribution, domainVal: number = Math.random()) => {
    if (dist[0] === "u") {
        const min = dist[1]
        const max = dist[2]
        return domainVal * (max - min) + min
    } else if (dist[0] === "exp") {
        const min = dist[1]
        const max = dist[2]
        const diff = max - min
        const val = diff * Math.pow(domainVal + 1, domainVal) - diff + min
        return val
    } else if (dist[0] === "norm") {
        const min = dist[1]
        const max = dist[2]
        const diff = max - min
        const c = 2.5 // control parameter to determine the sharpness of the curve
        const val = diff * Math.exp(-(domainVal * c * 2 - c)) + min
        return val
    }
}
