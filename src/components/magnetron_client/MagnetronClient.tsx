import React from "react"
import MagnetronGame2d from "../magnetron_game/MagnetronGame2d"
import { Link, useRouteMatch } from "react-router-dom"
import useGameServer from "../../services/magnetronServerService/useGameServer"
import { Access } from "../../services/magnetronServerService/helpers"

type Props = {}
type RouteMatch = { pin: string; playerIndex: string }

const MagnetronClient: React.FC<Props> = () => {
    const { pin, playerIndex: playerIndexStr } = useRouteMatch<RouteMatch>().params
    const playerIndex = parseInt(playerIndexStr)

    const { gameAccess, state, possibleActions, performAction } = useGameServer(pin, playerIndex)

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
