import { MagState } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { BoardState } from "./stateTypes"
import { MagSimState } from "../../../../../services/magnetronServerService/types/gameTypes/simStateTypes"

export const magStateToBoardState = (state: MagState): BoardState => ({
    avatarPiecesWithPos: state.avatars.map((a) => ({ piece: a.piece, pos: a.position })),
    board: state.board,
})

export const simStateToBoardState = (simState: MagSimState): BoardState => ({
    avatarPiecesWithPos: simState.simAvatars.map((a) => ({
        piece: a.avatarState.piece,
        pos: a.avatarState.position,
    })),
    board: simState.board,
})

export const simStatesToBoardStates = (simStates: MagSimState[]): BoardState[] =>
    simStates.map(simStateToBoardState)
