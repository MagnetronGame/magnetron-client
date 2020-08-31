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
    justify-content: space-between;
`

const PinInputArea = styled.div``

const JoinButton = styled.button`
    outline: none;
    border-style: solid none;
    border-color: black;
    border-width: 3px;
    background: none;
    font-size: inherit;
`

const JoinGameBox = () => {
    return (
        <Wrapper>
            <PinInputArea>Pin: </PinInputArea>
            <JoinButton>Join game!</JoinButton>
        </Wrapper>
    )
}

export default JoinGameBox
