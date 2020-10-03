import { Vec2I } from "../services/magnetronServerService/types/gameTypes/stateTypes"

export type PartialVec2I = { [K in keyof Vec2I]?: Vec2I[K] }

export const equals = (vec1: Vec2I, vec2: Vec2I): boolean => vec1.x === vec2.x && vec1.y === vec2.y

export const equalTo = (vec: Vec2I) => (vecOther: Vec2I): boolean => equals(vec, vecOther)

export const toString = (vec: Vec2I) => `{Vec2I x=${vec.x} y=${vec.y}}`

export const add = (vec: Vec2I, addVec: PartialVec2I) => ({
    x: vec.x + (addVec.x || 0),
    y: vec.y + (addVec.y || 0),
})
