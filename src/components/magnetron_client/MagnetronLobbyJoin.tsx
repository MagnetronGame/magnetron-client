import React, { useEffect, useState } from "react"
import { Redirect, useLocation, useRouteMatch } from "react-router-dom"
import useJoinLobby from "../../services/magnetronServerService/useJoinLobby"
import { Access } from "../../services/magnetronServerService/helpers"
import { parseQueryParams } from "../../utils/queryParser"
import MagnetronCircle from "../MagnetronCircle"
import styled from "styled-components"
import Box from "../Box"
import Button from "../Button"

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const NameInput = styled.input<{ invalid?: boolean }>`
    width: 10em;
    background-color: ${(props) =>
        props.invalid ? props.theme.magnet.positiveColor.lighter : "white"};
    color: black;
    font-family: ${(props) => props.theme.fonts.types.cool};
    font-size: ${(props) => props.theme.fonts.sizes.medium};
    outline: none;
    border: none;
    border-bottom: 1px solid black;
`

const MagnetronLobbyJoin = () => {
    const routeParams = useRouteMatch<{ pin: string }>().params
    const pin = routeParams.pin
    const { joinAttempted, joinLobby, lobbyAccess, playerIndex } = useJoinLobby(pin)
    const [name, setName] = useState<string>("")
    const [nameInvalid, setNameInvalid] = useState<boolean>(false)
    const { autoJoinName } = parseQueryParams(useLocation().search)

    useEffect(() => {
        if (autoJoinName) {
            setName(autoJoinName)
            joinLobby(autoJoinName)
        }
    }, [autoJoinName, joinLobby])

    const handleNameChange = (name: string) => {
        setName(name)
        nameInvalid && setNameInvalid(false)
    }

    const handleNameClick = () => {
        if (name.length !== 0) {
            joinLobby(name)
        } else {
            setNameInvalid(true)
        }
    }

    if (!joinAttempted) {
        return (
            <Wrapper>
                <Box type={"blue"} style={{ padding: "20px 0" }}>
                    <NameInput
                        type={"text"}
                        placeholder={"name"}
                        value={name}
                        maxLength={10}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleNameClick()}
                        invalid={nameInvalid}
                        style={{ margin: "0 20px" }}
                    />
                    <Button
                        buttonType={"lined"}
                        style={{ margin: "24px", width: "100%" }}
                        onClick={() => handleNameClick()}
                    >
                        Join &rArr;
                    </Button>
                </Box>
            </Wrapper>
        )
    } else if (lobbyAccess === Access.ACCESSIBLE && playerIndex !== undefined) {
        return <Redirect to={`/client/lobby/${pin}/${playerIndex}`} />
    } else if (lobbyAccess === Access.NOT_ACCESSIBLE) {
        return <div style={{ textAlign: "center" }}>No game to join for pin: {pin} :(</div>
    } else {
        return <MagnetronCircle size={"small%"} rotation={"fast"} />
    }
}

export default MagnetronLobbyJoin
