import { VisPiece } from "./visPieces"

export type VisPieceChangeType = "add" | "remove" | "move"
export type VisPieceChangeListener = (type: VisPieceChangeType, visPiece: VisPiece) => void
