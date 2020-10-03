import { useRouteMatch } from "react-router-dom"
import React, { useEffect, useState } from "react"
import withLobbyAccess from "./withLobbyAccess"
import withAccessTokenOrRedirect from "./withAccessTokenOrRedirect"
import { Access } from "../services/magnetronServerService/helpers"
import * as lobbyApi from "../services/magnetronServerService/api/lobby"
import MagnetronCircle from "./MagnetronCircle"

export default (
    Comp: React.FC<{ accessToken: string; pin: string; playerIndex: number }>,
): React.FC<{ [k: string]: any }> =>
    withAccessTokenOrRedirect(({ accessToken, ...props }) => {
        const { pin, playerIndex: playerIndexStr } = useRouteMatch<{
            pin: string
            playerIndex: string
        }>().params
        const playerIndex = parseInt(playerIndexStr)
        const [access, setAccess] = useState<Access>(
            pin && !isNaN(playerIndex) ? Access.CHECKING : Access.NOT_ACCESSIBLE,
        )

        useEffect(() => {
            if (access === Access.CHECKING && pin && !isNaN(playerIndex)) {
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
                return (
                    <Comp
                        accessToken={accessToken}
                        pin={pin}
                        playerIndex={playerIndex}
                        {...props}
                    />
                )
            case Access.NOT_ACCESSIBLE:
                return <div style={{ textAlign: "center" }}>No lobby to join for pin: {pin} :(</div>
        }
    })
