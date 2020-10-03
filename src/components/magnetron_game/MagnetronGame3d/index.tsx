import React, { useEffect, useRef, useState } from "react"
import { Magnetron } from "./magnetron"
import styled from "styled-components"
import { addOrReplace, replace } from "../../../utils/arrayUtils"
import { MagnetColorByType } from "../../../MagnetronTheme"
import {
    MagState,
    Vec2I,
} from "../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { MagAction } from "../../../services/magnetronServerService/types/gameTypes/actionTypes"

type Props = {
    className?: string
    style?: React.CSSProperties
    magState: MagState
    possibleMagActions?: MagAction[]
    onMagAction?: (action: MagAction) => void
}

const GameOverlay = styled.div<{ color?: string }>`
    background-color: ${(props) => props.color || "none"};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`

const PlayerAvatarField = styled.div<{ x: number; y: number }>`
    position: absolute;
    color: white;
    top: ${(props) => props.y - 8}px;
    left: ${(props) => props.x - 8}px;
    font-family: ${(props) => props.theme.fonts.types.cool};
    font-size: 16px;
`

const WinnerField = styled.div<{ color: string }>`
    width: 100%;
    height: 100%;
    color: ${(props) => props.color};
    font-family: ${(props) => props.theme.fonts.types.cool};
    font-size: ${(props) => props.theme.fonts.sizes.large};
    display: flex;
    justify-content: center;
    align-items: start;
`

const MagnetronGame3d: React.FC<Props> = ({
    className,
    style,
    magState: state,
    possibleMagActions,
}) => {
    const rootNode = useRef<HTMLDivElement>(null)
    const magnetron = useRef<Magnetron>(null)
    const [initialState, setInitialState] = useState<boolean>(true)
    const [avatarsScreenPosition, setAvatarsScreenPosition] = useState<(Vec2I | null)[]>([])
    const [gameTerminal, setGameTerminal] = useState<boolean>(false)

    useEffect(() => {
        if (rootNode.current) {
            // @ts-ignore
            magnetron.current = new Magnetron(rootNode.current)
            magnetron.current.onAvatarsScreenPositionChange = (avatar, avatarPosition) =>
                setAvatarsScreenPosition((oldPositions) =>
                    addOrReplace(oldPositions, avatar.index, avatarPosition),
                )
            magnetron.current.onGameEnd = () => setGameTerminal(true)
        }
    }, [rootNode])

    useEffect(() => {
        if (magnetron.current && state) {
            if (initialState) {
                magnetron.current.startAndLoop(state)
                setInitialState(false)
            } else {
                magnetron.current.updateState(state)
            }
        }
    }, [magnetron, state])

    return (
        <div style={{ width: "100%", height: "100%" }}>
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
            <div ref={rootNode} style={{ width: "100%", height: "100%" }}></div>
        </div>
    )
}

export default MagnetronGame3d
