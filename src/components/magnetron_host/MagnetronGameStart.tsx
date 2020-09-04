import React from "react"
import useGameCreate from "../services/magnetronServerService/useGameCreate"
import { useRouteMatch, Redirect } from "react-router-dom"
import { Access } from "../services/magnetronServerService/helpers"

const MagnetronGameCreate = () => {
    const routeParams = useRouteMatch<{ pin?: string }>().params
    const pin = routeParams.pin
    const gameAccess = useGameCreate(pin || "")

    const message =
        gameAccess === Access.CHECKING
            ? "Creating game..."
            : gameAccess === Access.NOT_ACCESSIBLE
            ? "Could not create game :("
            : undefined

    return message ? (
        <div style={{ textAlign: "center" }}>{message}</div>
    ) : (
        <Redirect to={`/host/game/${pin}`} />
    )
}

export default MagnetronGameCreate
