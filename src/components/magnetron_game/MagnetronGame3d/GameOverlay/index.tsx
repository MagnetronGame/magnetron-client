import React from "react"
import {
    AvatarState,
    Vec2I,
} from "../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { MagnetColorByType } from "../../../../MagnetronTheme"
import { PlayerTurn } from "./PlayerTurn"
import {
    AvatarPieceName,
    DisplayWinner,
    DisplayWinnerArea,
    OverlayGrid,
    OverlayPositioned,
    PlayerBoxArea,
    PlayerTurnArea,
    Wrapper,
} from "./elements"
import PlayerBox from "./PlayerBox"

export type PlayerInfo = {
    name: string
    avatar: AvatarState
    displayPos?: Vec2I
}

type Props = {
    className?: string
    playersInfo: PlayerInfo[]
    currentPlayerIndex: number
    playerIndicesWon?: number[]
    maxHandSize: number
}

const toDisplayTerminalStyle = (
    playerIndiesWon: number[],
    playersInfo: PlayerInfo[],
): { color: string; displayText: string } => {
    const playersWon = playerIndiesWon.map((pi) => playersInfo[pi])
    const firstPlayerWonMagnetType = playersWon[0].avatar.piece.magnetType
    const color = MagnetColorByType[firstPlayerWonMagnetType].standard
    const playersWonNames = playersWon.map((p) => p.name)
    const displayText = playersWonNames.join(" and ") + " won!"
    return {
        color,
        displayText,
    }
}

const GameOverlay: React.FC<Props> = ({
    className,
    playersInfo,
    currentPlayerIndex,
    playerIndicesWon,
    maxHandSize,
}) => {
    const displayTerminalStyle =
        playerIndicesWon && toDisplayTerminalStyle(playerIndicesWon, playersInfo)
    const currentPlayerInfo = playersInfo[currentPlayerIndex]
    return (
        <Wrapper className={className}>
            <OverlayPositioned>
                {playersInfo.map(
                    (player, index) =>
                        player.displayPos && (
                            <AvatarPieceName
                                key={index}
                                x={player.displayPos.x}
                                y={player.displayPos.y}
                            >
                                {player.name}
                            </AvatarPieceName>
                        ),
                )}
            </OverlayPositioned>
            <DisplayWinnerArea>
                {displayTerminalStyle && (
                    <DisplayWinner color={displayTerminalStyle.color}>
                        {displayTerminalStyle.displayText}
                    </DisplayWinner>
                )}
            </DisplayWinnerArea>
            <OverlayGrid>
                <PlayerTurnArea>
                    <PlayerTurn playerTurnName={currentPlayerInfo.name} />
                </PlayerTurnArea>
                {playersInfo.map(({ avatar, name }, i) => (
                    <PlayerBoxArea key={i} playerIndex={i}>
                        <PlayerBox
                            playerIndex={i}
                            name={name}
                            avatarData={avatar.avatarData}
                            maxHandSize={maxHandSize}
                        />
                    </PlayerBoxArea>
                ))}
            </OverlayGrid>
        </Wrapper>
    )
}

export default GameOverlay
