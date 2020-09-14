import React, { useState } from "react"
import styled from "styled-components"
import Box from "../Box"
import Button from "../Button"
import { isNumeric } from "../../utils/stringUtils"
import { useHistory } from "react-router-dom"

type Props = {}

const InputPinArea = styled.div`
    display: flex;
    justify-content: center;
    padding-bottom: 5px;
    box-sizing: border-box;
`
const PinLabel = styled.span``
const PinInput = styled.input<{ invalid?: boolean }>`
    height: 100%;
    width: 4em;
    background-color: ${(props) =>
        props.invalid ? props.theme.magnet.positiveColor.lighter : "white"};
    color: black;
    font-family: "Krona One", sans-serif;
    font-size: 36px;
    outline: none;
    border: none;
    border-bottom: 1px solid black;
`

const validatePinInput = (pin: string): boolean => pin.length === 4 && validatePartialPinInput(pin)

const validatePartialPinInput = (pin: string) =>
    pin.length === 0 || [...pin].every((c) => isNumeric(c))

const JoinGameBox: React.FC<Props> = () => {
    const [inputPin, setInputPin] = useState<string>("")
    const [inputPinInvalid, setInputPinInvalid] = useState<boolean>(false)
    const history = useHistory()

    const handleInputPinChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        if (validatePartialPinInput(value)) {
            setInputPin(value)
            inputPinInvalid && setInputPinInvalid(false)
        }
    }

    const handleJoinGameClicked = () => {
        if (validatePinInput(inputPin)) {
            history.push(`/client/lobby/join/${inputPin}`)
        } else {
            setInputPinInvalid(true)
        }
    }

    return (
        <Box type={"red"} style={{ padding: "0 0", width: "100%", height: "100%" }}>
            <InputPinArea>
                <PinLabel>Pin:&nbsp;</PinLabel>
                <PinInput
                    type={"text"}
                    maxLength={4}
                    placeholder={"1234"}
                    value={inputPin}
                    invalid={inputPinInvalid}
                    onChange={handleInputPinChange}
                    onKeyDown={(e) => e.key === "Enter" && handleJoinGameClicked()}
                />
            </InputPinArea>
            <Button
                buttonType={"lined"}
                fontSize={"large"}
                onClick={() => handleJoinGameClicked()}
                style={{ width: "100%", padding: "0 inherit" }}
            >
                Join game &rArr;
            </Button>
        </Box>
    )
}

export default JoinGameBox
