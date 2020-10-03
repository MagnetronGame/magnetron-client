import React from "react"
import MagnetronGame3d from "../../magnetron_game/MagnetronGame3d"
import useGameServer from "../../../services/magnetronServerService/useGameServer"
import withGameAccess from "../../withGameAccess"
import { GameId } from "../../../services/magnetronServerService/types/serverTypes"

type Props = {
    accessToken: string
    gameId: GameId
}

const MagnetronHost: React.FC<Props> = ({ accessToken, gameId }) => {
    const { stateView, possibleActions } = useGameServer(accessToken, gameId, "HOST")

    return (
        <div style={{ height: "100%" }}>
            {stateView && (
                <MagnetronGame3d
                    magState={stateView.currentState}
                    possibleMagActions={possibleActions}
                    onMagAction={() => console.log("Cannot perform actions on the host")}
                />
            )}
        </div>
    )
}

export default withGameAccess(MagnetronHost)
