import React, { useState } from "react"
import styled from "styled-components"
import { MagnetronTheme } from "../../magnetronGameStyle"
import { Link } from "react-router-dom"

const Wrapper = styled.div`
    box-sizing: border-box;
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.75);
    width: 100%;
    height: 100%;
    background-color: ${MagnetronTheme.magnet.positiveColor.standard};
    border-radius: 20px;
    font-size: 32px;
    color: white;
    padding: 20px 20px;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
`

const InputPinArea = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 5px;
    box-sizing: border-box;
`
const PinLabel = styled.span``
const PinInput = styled.input`
    height: 100%;
    width: 4em;
    color: black;
    font-family: "Krona One", sans-serif;
    font-size: 36px;
    outline: none;
    border: none;
    border-bottom: 1px solid black;
`

const JoinButton = styled(Link)`
    //width: 70%;
    outline: none;
    border-style: solid none;
    border-color: black;
    border-width: 3px;
    background-color: #ffffff44;
    text-decoration: none;
    font-size: inherit;
    cursor: pointer;
    color: black;
    text-align: center;
    &:hover {
        background-color: #ffffff70;
    }
`

const JoinGameBox = () => {
    const [inputPin, setInputPin] = useState<string>("")

    return (
        <Wrapper>
            <InputPinArea>
                <PinLabel>Pin:&nbsp;</PinLabel>
                <PinInput
                    type={"text"}
                    maxLength={4}
                    placeholder={"1234"}
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                />
            </InputPinArea>
            <JoinButton to={`/client/lobby/join/${inputPin}`}>Join game &rArr;</JoinButton>
        </Wrapper>
    )
}

export default JoinGameBox
