import styled from "styled-components"
import MagnetronCircle from "../../MagnetronCircle"
import { Link } from "react-router-dom"
import React from "react"
import { MagnetronTheme } from "../../../magnetronGameStyle"

export const Overlay = styled.div<{ opacity?: number }>`
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, ${(props) => props.opacity || 1});

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export const OverlayText = styled.div`
    text-align: center;
    font-family: "Krona One", sans-serif;
    font-size: 32px;
    color: white;
`

const OverlayGameOverWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export const OverlayGameOver = ({ linkTo }: { linkTo: string }) => (
    <Overlay opacity={0.8}>
        <OverlayGameOverWrapper>
            <OverlayText style={{ color: MagnetronTheme.magnet.negativeColor.standard }}>
                Game over
            </OverlayText>
            <MagnetronCircle size={"full%"} style={{ height: "30%" }} />
            <Link to={linkTo} style={{ textDecoration: "none" }}>
                <OverlayText>&rArr;</OverlayText>
            </Link>
        </OverlayGameOverWrapper>
    </Overlay>
)
