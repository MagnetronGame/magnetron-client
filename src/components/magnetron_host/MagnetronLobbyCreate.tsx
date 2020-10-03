import React from "react"
import useCreateLobby from "../../services/magnetronServerService/useCreateLobby"
import { Redirect } from "react-router-dom"
import MagnetronCircle from "../MagnetronCircle"

const MagnetronLobbyCreate = () => {
    const { pin } = useCreateLobby()

    return pin ? (
        <Redirect to={`/host/lobby/${pin}`} />
    ) : (
        <MagnetronCircle size={"small%"} rotation={"fast"} />
    )
}

export default MagnetronLobbyCreate
