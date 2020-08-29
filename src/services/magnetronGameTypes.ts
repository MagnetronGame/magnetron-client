export enum MagnetType {
    POSITIVE = "POSITIVE",
    NEGATIVE = "NEGATIVE",
    FAKE = "FAKE",
    UNKNOWN = "UNKNOWN",
}

export type Piece = {
    type: string
}

export interface Avatar extends Piece {
    index: number
    magnetType: MagnetType
    coins: number
    hand: MagnetType[]
}

export interface CoinPiece extends Piece {
    value: number
}

export interface MagnetPiece extends Piece {
    magnetType: MagnetType
}

export interface EmptyPiece extends Piece {}

export const StaticPieces: {
    COIN_1: CoinPiece
    MAGNET_POS: MagnetPiece
    MAGNET_NEG: MagnetPiece
    MAGNET_FAKE: MagnetPiece
    EMPTY: EmptyPiece
} = {
    COIN_1: {
        value: 1,
        type: "CoinPiece",
    },
    MAGNET_POS: {
        type: "MagnetPiece",
        magnetType: MagnetType.POSITIVE,
    },
    MAGNET_NEG: {
        type: "MagnetPiece",
        magnetType: MagnetType.NEGATIVE,
    },
    MAGNET_FAKE: {
        type: "MagnetPiece",
        magnetType: MagnetType.FAKE,
    },
    EMPTY: {
        type: "EmptyPiece",
    },
}

export interface MagStaticState {
    avatarCount: number
    boardWidth: number
    boardHeight: number
    roundCountBeforeSimulation: number
}

export type MagBoard = Piece[][]

export type Vec2I = {
    x: number
    y: number
}

export interface MagState {
    staticState: MagStaticState
    roundCount: number
    roundStartIndex: number
    simulationsCount: number
    avatarTurnIndex: number
    avatars: Avatar[]
    avatarsBoardPosition: Vec2I[]
    board: MagBoard
    didSimulate: boolean
    simulationStates: MagState[]
}

export interface MagAction {
    handPieceIndex: number
    boardPosition: Vec2I
}
