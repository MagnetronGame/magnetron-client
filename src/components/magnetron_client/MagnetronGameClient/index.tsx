import React, { useEffect, useState } from "react"
import MagnetronGame2d from "../../magnetron_game/MagnetronGame2d"
import { Link, useLocation, useRouteMatch } from "react-router-dom"
import useGameServer from "../../../services/magnetronServerService/useGameServer"
import { Access } from "../../../services/magnetronServerService/helpers"
import { MagAction, MagState } from "../../../services/magnetronServerService/magnetronGameTypes"
import { parseQueryParams } from "../../../utils/queryParser"
import { Overlay, OverlayGameOver, OverlayText } from "./elements"
import MagnetronCircle from "../../MagnetronCircle"

type Props = {}
type RouteMatch = { pin: string; playerIndex: string }

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
        if (magState && magState.avatarTurnIndex === playerIndex && actionsBuffer.length > 0) {
            const [nextAction, ...rest] = actionsBuffer
            performAction(nextAction)
            setActionsBuffer(rest)
        }
    }, [magState, playerIndex])
}

const MagnetronGameClient: React.FC<Props> = () => {
    const { pin, playerIndex: playerIndexStr } = useRouteMatch<RouteMatch>().params
    const playerIndex = parseInt(playerIndexStr)

    const { gameAccess, state: magState, possibleActions, performAction } = useGameServer(
        pin,
        playerIndex,
    )
    const [simulating, setSimulating] = useState<boolean>(false)
    const [gameOver, setGameOver] = useState<boolean>(false)

    useActionBuffer(magState, playerIndex, performAction)

    useEffect(() => {
        if (magState && magState.didSimulate) {
            setSimulating(true)
            const simulationTime =
                (simulationTimeBase + magState.simulationStates.length * simulationTimePerState) *
                1000
            const gameOverAfterSimulate = magState.isTerminal
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
        const myTurn = magState.avatarTurnIndex === playerIndex
        const overlay = simulating ? (
            <Overlay opacity={1}>
                <MagnetronCircle size={"small%"} rotation={"slow"} />
            </Overlay>
        ) : gameOver ? (
            <OverlayGameOver linkTo={"/"} />
        ) : (
            !myTurn && (
                <Overlay opacity={0.6}>
                    <OverlayText>Player {magState.avatarTurnIndex}'s turn</OverlayText>
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
        return gameAccess === Access.NOT_ACCESSIBLE ? (
            <div style={{ textAlign: "center" }}>Could not connect to game :(</div>
        ) : (
            <MagnetronCircle size={"small%"} rotation={"fast"} />
        )
    }
}

export default MagnetronGameClient
