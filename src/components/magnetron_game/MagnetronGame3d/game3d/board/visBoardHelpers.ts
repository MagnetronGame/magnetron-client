import {
    AvatarPiece,
    Piece,
    PieceType,
} from "../../../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import * as THREE from "three"
import { VisAvatarHeight } from "./visualObjects/visPieces"
import { VisBoard } from "./visualObjects/visBoard"

const getPiecesCurrentWorldPosOfType = <T extends Piece>(
    visBoard: VisBoard,
    type: PieceType,
): [T, THREE.Vector3][] => {
    const allVisPieces = visBoard.getVisPieces()

    const visPiecesWithCurrentWorldPos = allVisPieces
        .filter((visPiece) => visPiece.pieceData.type === type)
        .map((visPiece) => [visPiece.pieceData as T, visPiece.pieceObject.position])
    return visPiecesWithCurrentWorldPos as [T, THREE.Vector3][]
}

export const getSortedAvatarsWorldPos = (visBoard: VisBoard): THREE.Vector3[] => {
    return getPiecesCurrentWorldPosOfType<AvatarPiece>(visBoard, "AvatarPiece")
        .sort(([a1], [a2]) => a1.ownerAvatarIndex - a2.ownerAvatarIndex)
        .map(([, worldPos]) => worldPos.clone().add(new THREE.Vector3(0, VisAvatarHeight, 0)))
}
