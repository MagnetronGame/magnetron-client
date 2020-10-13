import { VisBoard } from "./board/visualObjects/visBoard"

import { Anims } from "./animation/animationHelpers"
import {
    AvatarPiece,
    isMagnetPiece,
    MagnetPiece,
} from "../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { Anim } from "./animation/animationTypes"
import { ChangedPieceWithPos, StateDelta } from "./state_manager/state_delta/stateDeltaTypes"

export const updateBoardByDelta = (stateDelta: StateDelta, visBoard: VisBoard): Anim => {
    const enterPiecesAnims = stateDelta.enterPieces.map((enterPiece) =>
        visBoard.addPiece(enterPiece.piece, enterPiece.pos),
    )

    const exitPiecesAnims = stateDelta.exitPieces.map((exitPiece) =>
        visBoard.removePiece(exitPiece.piece.id),
    )

    const moveAvatarPiecesAnims = stateDelta.movedPieces
        .filter((movedPiece) => movedPiece.piece.type === "AvatarPiece")
        .map((movedPiece) =>
            Anims.chained([
                // { duration: 0.5 },
                // this.createNeighbourMagnetsEffect(
                //     movedPiece.piece as AvatarPiece,
                //     movedPiece.prevPos,
                // ),
                visBoard.movePiece(movedPiece.piece.id, movedPiece.prevPos, movedPiece.pos),
                // { duration: 0.5 },
            ]),
        )

    const isChangedMagnetPiece = (
        changedPiece: ChangedPieceWithPos,
    ): changedPiece is ChangedPieceWithPos<MagnetPiece> => isMagnetPiece(changedPiece.piece)

    const changePiecesAnims = stateDelta.changedPieces
        .filter<ChangedPieceWithPos<MagnetPiece>>(isChangedMagnetPiece)
        .filter((changedPiece) => changedPiece.changedProperties.magnetType)
        .map((changedPiece) =>
            Anims.chained([
                visBoard.removePiece(changedPiece.piece.id),
                visBoard.addPiece(changedPiece.piece, changedPiece.pos),
            ]),
        )

    const stateUpdateAnims = [
        Anims.chained(exitPiecesAnims, "exited pieces"),
        Anims.chained(enterPiecesAnims, "entered pieces"),
        Anims.chained(moveAvatarPiecesAnims, "moved pieces"),
        Anims.chained(changePiecesAnims, "changed pieces"),
    ].filter((anim) => anim.anims.length !== 0)

    return Anims.chained(stateUpdateAnims, "state update")
}
