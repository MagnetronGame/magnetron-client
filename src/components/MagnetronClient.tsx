import React, { useEffect, useState } from "react"
import MagnetronGame2d from "./MagnetronGame2d"
import { Link, useLocation, useRouteMatch, useParams } from "react-router-dom"
import useGameServerClient from "../services/magnetronServerService/useGameServerClient"

type Props = {}
type RouteMatch = { pin: string; playerIndex: string }

const MagnetronClient: React.FC<Props> = () => {
    const params = useRouteMatch<RouteMatch>().params
    const pin = params.pin
    const playerIndex = parseInt(params.playerIndex)

    const { gameAccessible, myTurn, state, possibleActions, performAction } = useGameServerClient(
        pin,
        playerIndex,
    )

    const message: string | undefined =
        gameAccessible === undefined
            ? "Two sec..."
            : !gameAccessible
            ? "Could not connect to game :("
            : !state
            ? "Waiting for game"
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
            <span>
                <Link to={"/"} style={{ textDecoration: "none" }}>
                    &lArr; Back
                </Link>
            </span>
            {message ? messageElem : gameElem}
        </div>
    )
}

export default MagnetronClient
