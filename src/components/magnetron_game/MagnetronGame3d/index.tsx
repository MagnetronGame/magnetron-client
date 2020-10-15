import React, { useEffect, useRef, useState } from "react"
import { addOrReplace } from "../../../utils/arrayUtils"
import { MagnetColorByType } from "../../../MagnetronTheme"
import {
    MagState,
    Vec2I,
} from "../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { MagAction } from "../../../services/magnetronServerService/types/gameTypes/actionTypes"
import { Magnetron3d } from "./game3d/Magnetron3d"
import { GameOverlay, GameRootNode, PlayerAvatarField, WinnerField, Wrapper } from "./elements"

type Props = {
    className?: string
    style?: React.CSSProperties
    magState: MagState
    possibleMagActions?: MagAction[]
    onMagAction?: (action: MagAction) => void
}

const MagnetronGame3d: React.FC<Props> = ({ className, style, magState: state }) => {
    const rootNode = useRef<HTMLDivElement>(null)
    const magnetronRef = useRef<Magnetron3d>(null)
    const [avatarsScreenPosition, setAvatarsScreenPosition] = useState<(Vec2I | null)[]>([])
    const [gameTerminal, setGameTerminal] = useState<boolean>(false)

    useEffect(() => {
        if (state) {
            if (!magnetronRef.current && rootNode.current) {
                const magnetron = new Magnetron3d(rootNode.current, state)

                magnetron.listeners.onAvatarDisplayPositionChange((avatar, avatarPosition) =>
                    setAvatarsScreenPosition((oldPositions) =>
                        addOrReplace(oldPositions, avatar.ownerAvatarIndex, avatarPosition),
                    ),
                )
                magnetron.listeners.onGameEnd().then(() => setGameTerminal(true))
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
            <GameOverlay>
                {avatarsScreenPosition.map(
                    (pos, index) =>
                        pos && (
                            <PlayerAvatarField key={index} x={pos.x} y={pos.y}>
                                {index}
                            </PlayerAvatarField>
                        ),
                )}
                {gameTerminal && (
                    <WinnerField
                        color={
                            MagnetColorByType[
                                state.avatars[state.lifecycleState.avatarIndicesWon[0] || 0].piece
                                    .magnetType
                            ].standard
                        }
                    >
                        {state.lifecycleState.avatarIndicesWon
                            .map((i) => `Player ${i}`)
                            .join(" and ")}{" "}
                        won!
                    </WinnerField>
                )}
            </GameOverlay>
            <GameRootNode ref={rootNode} />
        </Wrapper>
    )
}

export default MagnetronGame3d
