import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { ApiAddressesType, setApiAddress } from "../services/magnetronServerService/gameServerApi"
import ButtonMagnet from "./Button"

type Props = {}

const Wrapper = styled.div`
    width: 100%;
    //height: 64px;
    display: flex;
`

const AdminBar: React.FC<Props> = () => {
    const [gameServerApiAddress, setGameServerApiAddress] = useState<ApiAddressesType>(
        () => localStorage.gameServerAddress || "PUBLIC",
    )

    useEffect(() => {
        setApiAddress(gameServerApiAddress)
        localStorage.gameServerAddress = gameServerApiAddress
    }, [gameServerApiAddress])

    return (
        <Wrapper>
            <ButtonMagnet
                buttonType={"blue"}
                fontSize={"small"}
                onClick={() =>
                    setGameServerApiAddress((currAddr) =>
                        currAddr === "PUBLIC" ? "LOCAL" : "PUBLIC",
                    )
                }
            >
                <span style={{ color: "#cccccc" }}>Backend: </span>
                {gameServerApiAddress}
            </ButtonMagnet>
        </Wrapper>
    )
}

export default AdminBar
