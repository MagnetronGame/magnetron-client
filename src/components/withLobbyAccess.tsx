import React, { useEffect, useState } from "react"
import { useRouteMatch } from "react-router-dom"
import { Access } from "../services/magnetronServerService/helpers"
import * as lobbyApi from "../services/magnetronServerService/api/lobby"
import MagnetronCircle from "./MagnetronCircle"
import withAccessTokenOrRedirect from "./withAccessTokenOrRedirect"

export default (
    Comp: React.FC<{ accessToken: string; pin: string }>,
): React.FC<{ [k: string]: any }> =>
    withAccessTokenOrRedirect(({ accessToken, ...props }) => {
        const { pin } = useRouteMatch<{
            pin: string
        }>().params
        const [access, setAccess] = useState<Access>(pin ? Access.CHECKING : Access.NOT_ACCESSIBLE)

        useEffect(() => {
            if (access === Access.CHECKING && accessToken && pin) {
                lobbyApi
                    .getLobby(accessToken, pin)
                    .then(() => setAccess(Access.ACCESSIBLE))
                    .catch(() => setAccess(Access.NOT_ACCESSIBLE))
            }
        }, [access, pin, accessToken])

        switch (access) {
            case Access.CHECKING:
                return <MagnetronCircle size={"small%"} rotation={"fast"} />
            case Access.ACCESSIBLE:
                return <Comp accessToken={accessToken} pin={pin} {...props} />
            case Access.NOT_ACCESSIBLE:
                return <div style={{ textAlign: "center" }}>No lobby to join for pin: {pin} :(</div>
        }
    })
