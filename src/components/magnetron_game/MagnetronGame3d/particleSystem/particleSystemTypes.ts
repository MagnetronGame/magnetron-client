import * as THREE from "three"

export type ParticleColor = THREE.Color | string | number

export type ParticleCircleFormation = {
    formation: "circle"
    radiusInner: number
    radiusOuter: number
}

export type ParticleSphereFormation = {
    formation: "sphere"
    radiusInner: number
    radiusOuter: number
}

export type ParticleRectangleFormation = {
    formation: "rectangle"
    widthInner: number
    widthOuter: number
    heightInner: number
    heightOuter: number
}

export type ParticleFormation =
    | ParticleCircleFormation
    | ParticleRectangleFormation
    | ParticleSphereFormation

export type ValueRange = { min: number; max: number }

// All speed related props are given as units per second
export type ParticleSystemConfigAbsolute = {
    centerPosition: THREE.Vector3
    formation: ParticleFormation
    direction: THREE.Vector3
    particleLifetime: Distribution
    particleCreationTime: Distribution
    particleSpeedMin: number
    particleSpeedMax: number
    particleSpread: number
    distanceSpeedFactor: number
    particlePositionDistortMax: number
    particlePositionDistortMin: number
    color: ParticleColor
    particleSizeMin: number // TODO: not supported min and max. Largest will be used
    particleSizeMax: number
    particleCount: number
}

export type ParticleSystemConfig = {
    [K in keyof ParticleSystemConfigAbsolute]?: ParticleSystemConfigAbsolute[K]
}

export type UniformDist = ["u", number, number] // min, max
export type ExpDist = ["exp", number, number, number] // min, max, factor
export type NormDist = ["norm", number, number, number] // min, max, var([0, 1], 0 - all mean, 1 - uniform)
export type Distribution = UniformDist | ExpDist | NormDist
