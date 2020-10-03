import React, { useEffect, useState } from "react"
import { GameId } from "../services/magnetronServerService/types/serverTypes"
import { useRouteMatch } from "react-router-dom"
import { Access } from "../services/magnetronServerService/helpers"
import * as gameApi from "../services/magnetronServerService/api/gameSession"
import MagnetronCircle from "./MagnetronCircle"
import withAccessTokenOrRedirect from "./withAccessTokenOrRedirect"

export default (
    Comp: React.FC<{ accessToken: string; gameId: GameId }>,
): React.FC<{ [k: string]: any }> =>
    withAccessTokenOrRedirect(({ accessToken, ...props }) => {
        const { gameId } = useRouteMatch<{ gameId: string }>().params
        const [access, setAccess] = useState<Access>(
            gameId ? Access.CHECKING : Access.NOT_ACCESSIBLE,
        )

        useEffect(() => {
            if (access === Access.CHECKING && gameId) {
                gameApi
                    .gameState(accessToken, gameId)
                    .then(() => setAccess(Access.ACCESSIBLE))
                    .catch(() => setAccess(Access.NOT_ACCESSIBLE))
            }
        }, [access, gameId, accessToken])

        switch (access) {
            case Access.CHECKING:
                return <MagnetronCircle size={"small%"} rotation={"fast"} />
            case Access.ACCESSIBLE:
                return <Comp accessToken={accessToken} gameId={gameId} {...props} />
            case Access.NOT_ACCESSIBLE:
                return <div style={{ textAlign: "center" }}>The game does not exist :(</div>
        }
    })
