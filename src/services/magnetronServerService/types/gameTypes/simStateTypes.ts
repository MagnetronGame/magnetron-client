import { AvatarState, MagBoard, Vec2I } from "./stateTypes"

export type SimAvatarState = {
    avatarState: AvatarState
    affectedPositions: Vec2I[]
}

export type SimCollisionState = {
    simAvatars: SimAvatarState[]
    board: MagBoard
}

export type MagSimState = {
    simAvatars: SimAvatarState[]
    board: MagBoard
    collisionStates: SimCollisionState[]
}
