import React, { useEffect, useState } from "react"
import { useRouteMatch } from "react-router-dom"
import { Access } from "../services/magnetronServerService/helpers"
import * as lobbyApi from "../services/magnetronServerService/api/lobby"
import MagnetronCircle from "./MagnetronCircle"

export default (Comp: React.FC<{ pin: string }>): React.FC<{ [k: string]: any }> => ({
    ...props
}) => {
    const { pin } = useRouteMatch<{
        pin: string
    }>().params
    const [access, setAccess] = useState<Access>(pin ? Access.CHECKING : Access.NOT_ACCESSIBLE)

    useEffect(() => {
        if (access === Access.CHECKING && pin) {
            lobbyApi
                .lobbyExists(pin)
                .then((access) => setAccess(access ? Access.ACCESSIBLE : Access.NOT_ACCESSIBLE))
        }
    }, [access, pin])

    switch (access) {
        case Access.CHECKING:
            return <MagnetronCircle size={"small%"} rotation={"fast"} />
        case Access.ACCESSIBLE:
            return <Comp pin={pin} {...props} />
        case Access.NOT_ACCESSIBLE:
            return <div style={{ textAlign: "center" }}>No lobby to join for pin: {pin} :(</div>
    }
}
