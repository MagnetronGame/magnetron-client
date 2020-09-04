import React, { useState } from "react"
import { Redirect, useRouteMatch } from "react-router-dom"
import useJoinLobby from "../services/magnetronServerService/useJoinLobby"
import { Access } from "../services/magnetronServerService/helpers"

const MagnetronLobbyJoin = () => {
    const routeParams = useRouteMatch<{ pin: string }>().params
    const pin = routeParams.pin
    const { joinAttempted, joinLobby, lobbyAccess, playerIndex } = useJoinLobby(pin)
    const [name, setName] = useState<string>("")

    const handleNameChange = (name: string) => {
        setName(name)
    }

    const handleNameClick = () => {
        if (name) {
            joinLobby(name)
        }
    }

    const message =
        lobbyAccess === Access.CHECKING
            ? "Two sec..."
            : lobbyAccess === Access.NOT_ACCESSIBLE
            ? `Could not join game :(`
            : undefined

    return (
        <div>
            {!joinAttempted ? (
                <>
                    <input
                        type={"text"}
                        placeholder={"name"}
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                    />
                    <input type={"button"} value={"Enter"} onClick={() => handleNameClick()} />
                </>
            ) : message ? (
                <div style={{ textAlign: "center" }}>{message}</div>
            ) : (
                pin &&
                playerIndex !== undefined && <Redirect to={`/client/lobby/${pin}/${playerIndex}`} />
            )}
        </div>
    )
}

export default MagnetronLobbyJoin
