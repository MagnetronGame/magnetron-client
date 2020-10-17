import React from "react"
import {
    PlayerBoxCoinRow,
    PlayerBoxHandRow,
    PlayerBoxName,
    StyledHandPiece,
    Wrapper,
} from "./elements"
import { AvatarData } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { range } from "../../../../../utils/arrayUtils"

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
                    <StyledHandPiece key={p.id} piece={p} maxHandSize={maxHandSize} />
                ))}
            </PlayerBoxHandRow>
            <PlayerBoxCoinRow>
                {range(avatarData.coins).map((_, i) => (
                    <span key={i}>O</span>
                ))}
            </PlayerBoxCoinRow>
        </Wrapper>
    )
}

export default PlayerBox
