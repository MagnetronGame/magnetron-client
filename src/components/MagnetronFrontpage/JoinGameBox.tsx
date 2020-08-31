import React from "react"
import styled from "styled-components"
import { MagnetColor } from "../../magnetronGameStyle"
import { MagnetType } from "../../services/magnetronGameTypes"

const Wrapper = styled.div`
    box-sizing: border-box;
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.75);
    width: 100%;
    height: 100%;
    background-color: ${MagnetColor[MagnetType.POSITIVE]};
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

const JoinButton = styled.button`
    //width: 70%;
    outline: none;
    border-style: solid none;
    border-color: black;
    border-width: 3px;
    background-color: #ffffff44;
    text-decoration: none;
    font-size: inherit;
    cursor: pointer;
    &:hover {
        background-color: #ffffff70;
    }
`

const JoinGameBox = () => {
    return (
        <Wrapper>
            <InputPinArea>
                <PinLabel>Pin:&nbsp;</PinLabel>
                <PinInput type={"text"} maxLength={4} placeholder={"1234"} />
            </InputPinArea>
            <JoinButton>Join game &rArr;</JoinButton>
        </Wrapper>
    )
}

export default JoinGameBox
