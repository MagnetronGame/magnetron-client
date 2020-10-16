import styled, { keyframes } from "styled-components"
import React, { useEffect, useState } from "react"

const rotateIn = keyframes`
  from {
    transform: rotate(-15deg) scale(2) translateY(70px);
  }
  to {
    transform: none;
  }
`

const PlayerTurnWrapper = styled.div`
    font-size: ${(props) => props.theme.fonts.sizes.largePlus};
    font-family: ${(props) => props.theme.fonts.types.cool};
    display: flex;
    justify-content: center;
`

const FlashPlayerTurnText = styled.div`
    animation: ${rotateIn} 2s linear;
`

export const PlayerTurn = ({ playerTurnName }: { playerTurnName: string }) => {
    const [delayedPlayerTurnName, setDelayedPlayerTurnName] = useState<string | null>(null)

    useEffect(() => {
        const timeoutHandle = setTimeout(() => setDelayedPlayerTurnName(playerTurnName), 3000)
        return () => clearTimeout(timeoutHandle)
    }, [playerTurnName])

    return (
        <PlayerTurnWrapper>
            {delayedPlayerTurnName && (
                <>
                    <FlashPlayerTurnText key={delayedPlayerTurnName}>
                        {delayedPlayerTurnName}
                    </FlashPlayerTurnText>
                    <span style={{ color: "rgba(0,0,0,0.3)" }}>'s turn</span>
                </>
            )}
        </PlayerTurnWrapper>
    )
}
