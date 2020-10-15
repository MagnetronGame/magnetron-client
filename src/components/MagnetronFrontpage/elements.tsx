import React, { PropsWithChildren } from "react"
import styled, { keyframes } from "styled-components"
import MagnetronTitleLogo from "../MagnetronTitleLogo"
import MagnetronHowTo from "../MagnetronHowTo"
import Button from "../Button"

export const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`

export const AppWrapper = styled.div`
    width: 100%;
    height: 100vh;
    //flex: 0 0 80%;
    font-family: "Roboto", sans-serif;

    display: grid;
    grid-template-columns: 1fr minmax(300px, 350px) 1fr;
    grid-template-rows: minmax(0, 1fr) 64px minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.5fr);
    grid-template-areas:
        "title title title"
        "nav nav nav"
        ". join-game ."
        ". host-game ."
        ". see-below .";
`

export const StyledMagnetronHowTo = styled(MagnetronHowTo)`
    width: 100%;
    height: 100%;
    padding: 0 10%;
    box-sizing: border-box;
`

const blinkFrames = keyframes`
  from {
    color: black;
  }

  to {
    color: white;
  }
`
export const SeeBelowArea = styled.div`
    grid-area: see-below;
    font-size: 32px;
    color: black;
    text-align: center;
    animation: ${blinkFrames} 1.5s linear infinite alternate;
`

export const TitleArea = styled.div`
    grid-area: title;
`

export const Title = styled(MagnetronTitleLogo)`
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
`

const NavBarAreaWrapper = styled.div`
    grid-area: nav;
    display: flex;
    justify-content: center;
`

export const NavBarArea: React.FC<PropsWithChildren<{}>> = ({ children }) => (
    <NavBarAreaWrapper>
        {React.Children.map(children, (child, i) => (
            <>
                {child}
                {i !== React.Children.count(children) - 1 && <span>&nbsp;|&nbsp;</span>}
            </>
        ))}
    </NavBarAreaWrapper>
)

export const JoinGameArea = styled.div`
    grid-area: join-game;
    padding: 20px;
`

export const HostGameArea = styled.div`
    grid-area: host-game;
    padding: 30px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
`

export const HostGameButton = styled(Button)`
    padding: 20px 10%;
`
