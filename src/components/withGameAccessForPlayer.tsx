import React, { useEffect, useState } from "react"
import { GameId } from "../services/magnetronServerService/types/serverTypes"
import withAccessTokenOrRedirect from "./withAccessTokenOrRedirect"
import { useRouteMatch } from "react-router-dom"
import { Access } from "../services/magnetronServerService/helpers"
import * as gameApi from "../services/magnetronServerService/api/gameSession"
import MagnetronCircle from "./MagnetronCircle"

export default (
    Comp: React.FC<{ accessToken: string; gameId: GameId; playerIndex: number }>,
): React.FC<{ [k: string]: any }> =>
    withAccessTokenOrRedirect(({ accessToken, ...props }) => {
        const { gameId, playerIndex: playerIndexStr } = useRouteMatch<{
            gameId: string
            playerIndex: string
        }>().params
        const playerIndex = parseInt(playerIndexStr)

        const [access, setAccess] = useState<Access>(
            gameId && !isNaN(playerIndex) ? Access.CHECKING : Access.NOT_ACCESSIBLE,
        )

        useEffect(() => {
            if (access === Access.CHECKING && gameId && !isNaN(playerIndex)) {
                gameApi
                    .gameStateForPlayer(accessToken, gameId, playerIndex)
                    .then(() => setAccess(Access.ACCESSIBLE))
                    .catch(() => setAccess(Access.NOT_ACCESSIBLE))
            }
        }, [access, gameId, accessToken, playerIndex])

        switch (access) {
            case Access.CHECKING:
                return <MagnetronCircle size={"small%"} rotation={"fast"} />
            case Access.ACCESSIBLE:
                return (
                    <Comp
                        accessToken={accessToken}
                        gameId={gameId}
                        playerIndex={playerIndex}
                        {...props}
                    />
                )
            case Access.NOT_ACCESSIBLE:
                return <div style={{ textAlign: "center" }}>The game does not exist :(</div>
        }
    })
