import React from "react"
import MagnetronTheme, { MagnetColorByType } from "../../../MagnetronTheme"
import styled from "styled-components"
import {
    AvatarPiece,
    MagnetPiece,
    Piece,
} from "../../../services/magnetronServerService/types/gameTypes/pieceTypes"
import { MagnetType } from "../../../services/magnetronServerService/types/gameTypes/stateTypes"

const CoinPieceComp: React.FC<{
    className?: string
    style?: React.CSSProperties
}> = ({ className, style }) =>
    // prettier-ignore
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"
         style={style} className={className}
    >
        <circle cx="64" cy="64" r="60" fill={MagnetronTheme.coin.colorInner} stroke={MagnetronTheme.coin.colorOuter} strokeWidth="8"/>
        <path d="M32.3441 34.764H43.4886L63.4574 54.803L83.4261 34.764H94.5706V89.7132H83.4261V50.1976L63.4574 69.428L43.4886 50.1976V89.7132H32.3441V34.764Z" fill={MagnetronTheme.coin.colorOuter}/>
    </svg>

const AvatarPieceComp: React.FC<{
    className?: string
    style?: React.CSSProperties
    avatarPiece: AvatarPiece
}> = ({ className, style, avatarPiece }) => {
    const magnetColor = MagnetColorByType[avatarPiece.magnetType]
    return (
        // prettier-ignore
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
             style={style} className={className}
        >
            <circle cx="32" cy="32" r="28" fill={magnetColor.standard} stroke={magnetColor.darker} strokeWidth="8"/>
        </svg>
    )
}

export const MagnetPieceComp: React.FC<{
    className?: string
    style?: React.CSSProperties
    magnetPiece: MagnetPiece
}> = ({ className, style, magnetPiece }) => {
    const magnetType = magnetPiece.magnetType
    const magnetColorStandard = MagnetColorByType[magnetType].standard

    // prettier-ignore
    return (<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"
             style={style} className={className}
        >
            <rect x="3" y="3" width="122" height="122" fill={MagnetronTheme.magnet.baseColorInner} stroke={MagnetronTheme.magnet.baseColorOuter} strokeWidth="6"/>
        { magnetType !== MagnetType.UNKNOWN &&
            ([MagnetType.POSITIVE, MagnetType.NEGATIVE].includes(magnetType)
                ? <>
                    <path d="M22 64L64.5 64L107 64" stroke={magnetColorStandard} strokeWidth="10"/>
                    { magnetType === MagnetType.POSITIVE &&
                        <path d="M64 22L64 64.5L64 107" stroke={magnetColorStandard} strokeWidth="10"/>
                    }
                </>
                : <path d="M59 64H64H69" stroke={magnetColorStandard} strokeWidth="10"/>
            )
        }
        </svg>)
}

const AvatarPlayerMeta = styled.div`
    position: fixed;
    z-index: 0;
    color: white;
    font-family: "Krona One", sans-serif;
    font-size: 32px;
`

export const PieceComp: React.FC<{
    className?: string
    style?: React.CSSProperties
    piece: Piece
}> = ({ className, style, piece }) => {
    switch (piece.type) {
        case "AvatarPiece":
            return (
                <>
                    <AvatarPieceComp className={className} style={style} avatarPiece={piece} />
                    <AvatarPlayerMeta>{piece.ownerAvatarIndex}</AvatarPlayerMeta>
                </>
            )
        case "CoinPiece":
            return <CoinPieceComp className={className} style={style} />
        case "MagnetPiece":
            return <MagnetPieceComp className={className} style={style} magnetPiece={piece} />
        case "EmptyPiece":
        default:
            return <div className={className} style={style} />
    }
}
