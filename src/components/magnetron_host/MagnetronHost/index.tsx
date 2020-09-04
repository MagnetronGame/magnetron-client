import React from "react"
import MagnetronGame3d from "../magnetron_game/MagnetronGame3d"
import { useRouteMatch } from "react-router-dom"
import useGameServer from "../../services/magnetronServerService/useGameServer"
import { Access } from "../../services/magnetronServerService/helpers"

type Props = {}

type RouterMatch = {
    pin: string
}

const MagnetronHost: React.FC<Props> = () => {
    const pin = useRouteMatch<RouterMatch>().params.pin

    const { gameAccess, state, possibleActions } = useGameServer(pin, "HOST")

    const message =
        gameAccess === Access.CHECKING
            ? "Two sec..."
            : gameAccess === Access.NOT_ACCESSIBLE
            ? "No game available"
            : !state
            ? "Let's go!"
            : undefined

    const gameElem = state && (
        <MagnetronGame3d
            magState={state}
            possibleMagActions={possibleActions}
            onMagAction={() => console.log("Cannot perform actions on the host")}
        />
    )

    return (
        <div style={{ height: "100%" }}>
            {message ? <div style={{ textAlign: "center" }}>{message}</div> : gameElem}
        </div>
    )
}

export default MagnetronHost
