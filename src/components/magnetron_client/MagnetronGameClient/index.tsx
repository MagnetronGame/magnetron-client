import React, { useEffect, useState } from "react"
import MagnetronGame2d from "../../magnetron_game/MagnetronGame2d"
import { useLocation } from "react-router-dom"
import useGameServer from "../../../services/magnetronServerService/useGameServer"
import { parseQueryParams } from "../../../utils/queryParser"
import { Overlay, OverlayGameOver, OverlayText } from "./elements"
import MagnetronCircle from "../../MagnetronCircle"
import { MagState } from "../../../services/magnetronServerService/types/gameTypes/stateTypes"
import { MagAction } from "../../../services/magnetronServerService/types/gameTypes/actionTypes"
import withGameAccessForPlayer from "../../withGameAccessForPlayer"

type Props = {
    accessToken: string
    gameId: string
    playerIndex: number
}

const simulationTimeBase = 10
const simulationTimePerState = 2

const useActionBuffer = (
    magState: MagState | undefined,
    playerIndex: number,
    performAction: (action: MagAction) => void,
) => {
    const { actionsBuffer: rawActionsBuffer } = parseQueryParams(useLocation().search)
    const [actionsBuffer, setActionsBuffer] = useState<MagAction[]>(() =>
        rawActionsBuffer ? JSON.parse(decodeURI(rawActionsBuffer)) : [],
    )
    useEffect(() => {
        if (
            magState &&
            magState.playPhase.nextAvatarIndex === playerIndex &&
            actionsBuffer.length > 0
        ) {
            const [nextAction, ...rest] = actionsBuffer
            performAction(nextAction)
            setActionsBuffer(rest)
        }
    }, [magState, playerIndex])
}

const MagnetronGameClient: React.FC<Props> = ({ accessToken, gameId, playerIndex }) => {
    const { stateView, possibleActions, performAction } = useGameServer(
        accessToken,
        gameId,
        playerIndex,
    )
    const [simulating, setSimulating] = useState<boolean>(false)
    const [gameOver, setGameOver] = useState<boolean>(false)

    const magState = stateView?.currentState

    useActionBuffer(magState, playerIndex, performAction)

    useEffect(() => {
        if (magState && magState.simulationStates.length > 0) {
            setSimulating(true)
            const simulationTime =
                (simulationTimeBase + magState.simulationStates.length * simulationTimePerState) *
                1000
            const gameOverAfterSimulate = magState.lifecycleState.isTerminal
            const timeoutHandle = setTimeout(() => {
                setSimulating(false)
                gameOverAfterSimulate && setGameOver(true)
            }, simulationTime)
            return () => {
                clearTimeout(timeoutHandle)
                setSimulating(false)
            }
        }
    }, [magState])

    if (magState) {
        const myTurn = magState.playPhase.nextAvatarIndex === playerIndex
        const overlay = simulating ? (
            <Overlay opacity={1}>
                <MagnetronCircle size={"small%"} rotation={"slow"} />
            </Overlay>
        ) : gameOver ? (
            <OverlayGameOver linkTo={"/"} />
        ) : (
            !myTurn && (
                <Overlay opacity={0.6}>
                    <OverlayText>Player {magState.playPhase.nextAvatarIndex}'s turn</OverlayText>
                </Overlay>
            )
        )

        return (
            <div style={{ width: "100%", height: "100%" }}>
                {overlay}
                <MagnetronGame2d
                    playerIndex={playerIndex}
                    magState={magState}
                    possibleMagActions={possibleActions}
                    onMagAction={(action) => performAction(action)}
                    disabled={!myTurn || simulating || gameOver}
                />
            </div>
        )
    } else {
        return <MagnetronCircle size={"small%"} rotation={"fast"} />
    }
}

export default withGameAccessForPlayer(MagnetronGameClient)
