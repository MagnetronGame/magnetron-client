import React from "react"
import {
    Avatar,
    MagnetPiece,
    MagnetType,
    Piece,
} from "../../services/magnetronServerService/magnetronGameTypes"
import styled from "styled-components"
import { MagnetColor } from "../../magnetronGameStyle"

const MagnetPiecePosComp: React.FC<{
    className?: string
    style?: React.CSSProperties
}> = ({ className, style }) =>
    // prettier-ignore
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={style} className={className}
    >
        <rect x="3" y="3" width="122" height="122" fill="#C6CFD1" stroke="#7B9095" strokeWidth="6"/>
        <path d="M64 22L64 64.5L64 107" stroke="#FF3C2D" strokeWidth="10"/>
        <path d="M22 64L64.5 64L107 64" stroke="#FF3C2D" strokeWidth="10"/>
    </svg>

const MagnetPieceNegComp: React.FC<{
    className?: string
    style?: React.CSSProperties
}> = ({ className, style }) =>
    // prettier-ignore
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={style} className={className}
    >
        <rect x="3" y="3" width="122" height="122" fill="#C6CFD1" stroke="#7B9095" strokeWidth="6"/>
        <path d="M22 64L64.5 64L107 64" stroke="#433AFF" strokeWidth="10"/>
    </svg>

const MagnetPieceFakeComp: React.FC<{
    className?: string
    style?: React.CSSProperties
}> = ({ className, style }) =>
    // prettier-ignore
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={style} className={className}
    >
        <rect x="3" y="3" width="122" height="122" fill="#C6CFD1" stroke="#7B9095" strokeWidth="6"/>
        <path d="M59 64H64H69" stroke="#3B3B3B" strokeWidth="10"/>
    </svg>

const MagnetPieceUnknownComp: React.FC<{
    className?: string
    style?: React.CSSProperties
}> = ({ className, style }) =>
    // prettier-ignore
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={style} className={className}
    >
        <rect x="3" y="3" width="122" height="122" fill="#C6CFD1" stroke="#7B9095" strokeWidth="6"/>
    </svg>

const CoinPieceComp: React.FC<{
    className?: string
    style?: React.CSSProperties
}> = ({ className, style }) =>
    // prettier-ignore
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={style} className={className}
    >
        <circle cx="64" cy="64" r="60" fill="#FFD700" stroke="#DAA520" strokeWidth="8"/>
        <path d="M32.3441 34.764H43.4886L63.4574 54.803L83.4261 34.764H94.5706V89.7132H83.4261V50.1976L63.4574 69.428L43.4886 50.1976V89.7132H32.3441V34.764Z" fill="#DAA520"/>
    </svg>

const AvatarPieceComp: React.FC<{
    className?: string
    style?: React.CSSProperties
    avatarPiece: Avatar
}> = ({ className, style, avatarPiece }) => {
    const magnetColor = MagnetColor[avatarPiece.magnetType]
    return (
        // prettier-ignore
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
             style={style} className={className}
        >
            <circle cx="32" cy="32" r="28" fill="#4FD86D" stroke={magnetColor} strokeWidth="8"/>
        </svg>
    )
}

const MAGNET_PIECE_COMP_BY_TYPE = {
    [MagnetType.POSITIVE]: MagnetPiecePosComp,
    [MagnetType.NEGATIVE]: MagnetPieceNegComp,
    [MagnetType.FAKE]: MagnetPieceFakeComp,
    [MagnetType.UNKNOWN]: MagnetPieceUnknownComp,
}

export const MagnetPieceComp: React.FC<{
    className?: string
    style?: React.CSSProperties
    magnetPiece: MagnetPiece
}> = ({ className, style, magnetPiece }) => {
    const Piece = MAGNET_PIECE_COMP_BY_TYPE[magnetPiece.magnetType]

    return <Piece style={style} className={className} />
}

export const PieceComp: React.FC<{
    className?: string
    style?: React.CSSProperties
    piece: Piece
}> = ({ className, style, piece }) => {
    switch (piece.type) {
        case "Avatar":
            return (
                <AvatarPieceComp
                    className={className}
                    style={style}
                    avatarPiece={piece as Avatar}
                />
            )
        case "CoinPiece":
            return <CoinPieceComp className={className} style={style} />
        case "MagnetPiece":
            return (
                <MagnetPieceComp
                    className={className}
                    style={style}
                    magnetPiece={piece as MagnetPiece}
                />
            )
        case "EmptyPiece":
        default:
            return <div className={className} style={style} />
    }
}
