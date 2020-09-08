import React, { useEffect, useState } from "react"
import MagnetronGame2d from "../magnetron_game/MagnetronGame2d"
import { Link, useRouteMatch, useLocation } from "react-router-dom"
import useGameServer from "../../services/magnetronServerService/useGameServer"
import { Access } from "../../services/magnetronServerService/helpers"
import { MagAction } from "../../services/magnetronServerService/magnetronGameTypes"
import { parseQueryParams } from "../../utils/queryParser"

type Props = {}
type RouteMatch = { pin: string; playerIndex: string }

const MagnetronClient: React.FC<Props> = () => {
    const { pin, playerIndex: playerIndexStr } = useRouteMatch<RouteMatch>().params
    const playerIndex = parseInt(playerIndexStr)
    const { actionsBuffer: rawActionsBuffer } = parseQueryParams(useLocation().search)
    rawActionsBuffer && console.log("actions buffer:", JSON.parse(decodeURI(rawActionsBuffer)))

    const { gameAccess, state, possibleActions, performAction } = useGameServer(pin, playerIndex)
    const [actionsBuffer, setActionsBuffer] = useState<MagAction[]>(() =>
        rawActionsBuffer ? JSON.parse(decodeURI(rawActionsBuffer)) : [],
    )

    useEffect(() => {
        if (state && state.avatarTurnIndex === playerIndex && actionsBuffer.length > 0) {
            const [nextAction, ...rest] = actionsBuffer
            performAction(nextAction)
            setActionsBuffer(rest)
        }
    }, [state, playerIndex])

    const message =
        gameAccess === Access.CHECKING
            ? "Two sec..."
            : gameAccess === Access.NOT_ACCESSIBLE
            ? "Could not connect to game :("
            : !state
            ? "Let's go!"
            : undefined

    const messageElem = (
        <>
            <br />
            <div style={{ textAlign: "center" }}>{message}</div>
        </>
    )

    const gameElem = state && (
        <MagnetronGame2d
            playerIndex={playerIndex}
            magState={state}
            possibleMagActions={possibleActions}
            onMagAction={(action) => performAction(action)}
        />
    )

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {/*<span>*/}
            {/*    <Link to={"/"} style={{ textDecoration: "none", position: "absolute" }}>*/}
            {/*        &lArr; Back*/}
            {/*    </Link>*/}
            {/*</span>*/}
            {message ? messageElem : gameElem}
        </div>
    )
}

export default MagnetronClient
