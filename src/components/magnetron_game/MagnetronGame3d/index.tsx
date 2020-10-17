import React, { useEffect, useRef, useState } from "react"
import { addOrReplace } from "../../../utils/arrayUtils"
import { Vec2I } from "../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { MagAction } from "../../../services/magnetronServerService/types/gameTypes/actionTypes"
import { Magnetron3d } from "./game3d/Magnetron3d"
import { GameRootNode, Wrapper } from "./elements"
import { GameStateView } from "../../../services/magnetronServerService/types/serverTypes"
import GameOverlay, { PlayerInfo } from "./GameOverlay"

type Props = {
    className?: string
    style?: React.CSSProperties
    stateView: GameStateView
    possibleMagActions?: MagAction[]
    onMagAction?: (action: MagAction) => void
}

const MagnetronGame3d: React.FC<Props> = ({ className, style, stateView }) => {
    const rootNode = useRef<HTMLDivElement>(null)
    const magnetronRef = useRef<Magnetron3d>(null)
    const [avatarsScreenPosition, setAvatarsScreenPosition] = useState<(Vec2I | null)[]>([])
    const [gameTerminalAfterAnims, setGameTerminalAfterAnims] = useState<boolean>(false)

    const state = stateView.currentState
    const playersInfo: PlayerInfo[] = stateView.players.map((player, i) => ({
        name: player.name,
        avatar: state.avatars[i],
        displayPos: avatarsScreenPosition[i] || undefined,
    }))
    const playerIndicesWon: number[] | undefined = gameTerminalAfterAnims
        ? state.lifecycleState.avatarIndicesWon
        : undefined

    const currentPlayerIndex = state.playPhase.nextAvatarIndex

    useEffect(() => {
        if (state) {
            if (!magnetronRef.current && rootNode.current) {
                const magnetron = new Magnetron3d(rootNode.current, state)

                magnetron.listeners.onAvatarDisplayPositionChange((avatar, avatarPosition) =>
                    setAvatarsScreenPosition((oldPositions) =>
                        addOrReplace(oldPositions, avatar.ownerAvatarIndex, avatarPosition),
                    ),
                )
                magnetron.listeners.onGameEnd().then(() => setGameTerminalAfterAnims(true))
                // @ts-ignore
                magnetronRef.current = magnetron
            } else if (magnetronRef.current) {
                const magnetron = magnetronRef.current
                magnetron.updateState(state)
            }
        }
    }, [state, rootNode, magnetronRef])

    return (
        <Wrapper style={style} className={className}>
            <GameOverlay
                playersInfo={playersInfo}
                currentPlayerIndex={currentPlayerIndex}
                playerIndicesWon={playerIndicesWon}
                maxHandSize={state.staticState.avatarsStartingHand[0].length}
            />
            <GameRootNode ref={rootNode} />
        </Wrapper>
    )
}

export default MagnetronGame3d
