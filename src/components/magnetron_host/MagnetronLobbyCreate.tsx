import React from "react"
import useCreateLobby from "../services/magnetronServerService/useCreateLobby"
import { Redirect } from "react-router-dom"

const MagnetronLobbyCreate = () => {
    const { pin } = useCreateLobby()

    return pin ? (
        <Redirect to={`/host/lobby/${pin}`} />
    ) : (
        <div style={{ textAlign: "center" }}>Creating game...</div>
    )
}

export default MagnetronLobbyCreate
