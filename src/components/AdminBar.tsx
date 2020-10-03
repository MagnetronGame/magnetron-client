import React, { useEffect, useState } from "react"
import styled from "styled-components"
import ButtonMagnet from "./Button"
import { ApiAddressesType, setApiAddress } from "../services/magnetronServerService/api/url"

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
