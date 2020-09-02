import React from "react"
import MagnetronGame3d from "../MagnetronGame3d"
import { useRouteMatch } from "react-router-dom"
import useGameServerHost from "../../services/magnetronServerService/useGameServerHost"

type Props = {}

type RouterMatch = {
    pin: string
}

const MagnetronHost: React.FC<Props> = () => {
    const pin = useRouteMatch<RouterMatch>().params.pin
    const { gameAccessible, state, possibleActions } = useGameServerHost(pin)

    const gameElem = state ? (
        <MagnetronGame3d
            magState={state}
            possibleMagActions={possibleActions}
            onMagAction={(action) => console.log("Cannot perform actions on the host")}
        />
    ) : (
        <span>Waiting for server</span>
    )

    const invalidGameElem = <div>Could not connect to game :(</div>

    return <div style={{ height: "100%" }}>{gameAccessible ? gameElem : invalidGameElem}</div>
}

export default MagnetronHost
