import React, { useEffect, useState } from "react"
import MagnetronGame2d from "./MagnetronGame2d"
import { useGameServerAsClient } from "../services/gameServerService"
import { Link, useLocation, useRouteMatch } from "react-router-dom"

type Props = {}
type RouteMatch = { pin: string }

const MagnetronClient: React.FC<Props> = () => {
    const {
        invalidPin,
        joinGame,
        pin,
        myTurn,
        state,
        possibleActions,
        performAction,
    } = useGameServerAsClient()
    const routeMatch = useRouteMatch<RouteMatch>()
    const joinPin = routeMatch.params.pin
    console.log("url pin", joinPin)

    useEffect(() => {
        joinGame(joinPin)
    }, [joinPin, joinGame])

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <span>
                <Link to={"/"} style={{ textDecoration: "none" }}>
                    &lArr; Back
                </Link>
            </span>
            {invalidPin ? (
                <>
                    <br />
                    <div style={{ textAlign: "center" }}>Invalid pin: {pin}</div>
                </>
            ) : state ? (
                <MagnetronGame2d
                    magState={state}
                    possibleMagActions={possibleActions}
                    onMagAction={(action) => performAction(action)}
                />
            ) : (
                <>
                    <br />
                    <div style={{ textAlign: "center" }}>Two sec...</div>
                </>
            )}
        </div>
    )
}

export default MagnetronClient
