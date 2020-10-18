import React from "react"
import {
    HandPieceWrapper,
    PlayerBoxCoinRow,
    PlayerBoxHandRow,
    PlayerBoxName,
    StyledHandPiece,
    Wrapper,
} from "./elements"
import { AvatarData } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { range } from "../../../../../utils/arrayUtils"
import { PieceComp } from "../../../MagnetronGame2d/pieces"

type Props = {
    className?: string
    playerIndex: number
    name: string
    avatarData: AvatarData
    maxHandSize: number
}

const PlayerBox: React.FC<Props> = ({ className, playerIndex, name, avatarData, maxHandSize }) => {
    return (
        <Wrapper className={className} playerIndex={playerIndex}>
            <PlayerBoxName>{name}</PlayerBoxName>
            <PlayerBoxHandRow>
                {avatarData.hand.map((p) => (
                    <HandPieceWrapper key={p.id}>
                        <StyledHandPiece piece={p} />
                    </HandPieceWrapper>
                ))}
            </PlayerBoxHandRow>
            <PlayerBoxCoinRow>
                {range(avatarData.coins).map((_, i) => (
                    <HandPieceWrapper key={i}>
                        <StyledHandPiece
                            piece={{ id: i.toString(), type: "CoinPiece", value: 1 }}
                        />
                    </HandPieceWrapper>
                ))}
            </PlayerBoxCoinRow>
        </Wrapper>
    )
}

export default PlayerBox
