import { AvatarPiece, Piece } from "./pieceTypes"
import { MagStaticState } from "./staticStateTypes"
import { MagSimState } from "./simStateTypes"

export enum MagnetType {
    POSITIVE = "POSITIVE",
    NEGATIVE = "NEGATIVE",
    FAKE = "FAKE",
    UNKNOWN = "UNKNOWN",
}

export type Vec2I = {
    x: number
    y: number
}

export type AvatarData = {
    coins: number
    hand: Piece[]
}

export type MagStateLifecycle = {
    isInitialState: boolean
    simulationsCount: number
    isTerminal: boolean
    avatarIndicesWon: number[]
}

export type AvatarState = {
    avatarData: AvatarData
    piece: AvatarPiece
    position: Vec2I
}

export type PlayPhaseState = {
    startAvatarIndex: number
    nextAvatarIndex: number
    roundsCount: number
}

export type MagBoard = Piece[][]

export type MagState = {
    staticState: MagStaticState
    lifecycleState: MagStateLifecycle
    playPhase: PlayPhaseState
    avatars: AvatarState[]
    board: MagBoard
    simulationStates: MagSimState[]
}
