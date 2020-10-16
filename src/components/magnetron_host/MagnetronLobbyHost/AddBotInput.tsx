import React, { useState } from "react"
import styled from "styled-components"
import Button from "../../Button"

type Props = {
    onAddBot: (level: number) => void
}

const Wrapper = styled.div`
    border-radius: 10px;
    background-color: beige;
    display: flex;
`

const BotLevelInput = styled.input<{ invalid?: boolean }>`
    justify-self: center;
    width: 3em;

    border: none;
    box-sizing: border-box;
    border-bottom: 1px solid black;
    background-color: ${(props) =>
        props.invalid ? props.theme.magnet.positiveColor.lighter : "none"};
`

const isBotLevelValid = (botLevelRaw: string): boolean => {
    const botLevel = Number(botLevelRaw)
    return !isNaN(botLevel) && 0 <= botLevel && botLevel <= 7
}

const getBotLevelValid = (botLevelRaw: string): number | null =>
    isBotLevelValid(botLevelRaw) ? Number(botLevelRaw) : null

const tryFixBotLevel = (botLevelRaw: string): string | null => {
    if (isBotLevelValid(botLevelRaw) || botLevelRaw === "") {
        return botLevelRaw
    } else if (!isNaN(+botLevelRaw)) {
        const clampedBotLevel = Math.min(Math.max(+botLevelRaw, MIN_BOT_LEVEL), MAX_BOT_LEVEL)
        return clampedBotLevel.toString()
    } else {
        return null
    }
}

const MIN_BOT_LEVEL = 0
const MAX_BOT_LEVEL = 7

export default ({ onAddBot }: Props) => {
    const [botLevelRaw, setBotLevelRaw] = useState<string>("0")
    const [botLevelInvalid, setBotLevelInvalid] = useState<boolean>(false)

    const handleAddBotClicked = () => {
        const validBotLevel = getBotLevelValid(botLevelRaw)
        if (validBotLevel !== null) {
            onAddBot(validBotLevel)
        }
    }

    const handleBotLevelChange = (value: string) => {
        const fixedValue = tryFixBotLevel(value)
        const valueInvalid = fixedValue === null
        if (!valueInvalid) {
            setBotLevelRaw(fixedValue!)
        }
        if (valueInvalid !== botLevelInvalid) setBotLevelInvalid(valueInvalid)
    }

    return (
        <Wrapper onKeyPress={(e) => e.key === "Enter" && handleAddBotClicked()}>
            <BotLevelInput
                type={"number"}
                size={2}
                maxLength={2}
                min={0}
                max={7}
                invalid={botLevelInvalid}
                onChange={(e) => handleBotLevelChange(e.target.value)}
                value={botLevelRaw}
            />
            <Button
                buttonType={"blue"}
                fontSize={"small"}
                disabled={botLevelInvalid}
                onClick={handleAddBotClicked}
            >
                Add bot
            </Button>
        </Wrapper>
    )
}
