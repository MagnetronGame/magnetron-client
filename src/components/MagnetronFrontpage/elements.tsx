import styled from "styled-components"
import MagnetronTitleLogo from "../MagnetronTitleLogo"
import React, { PropsWithChildren } from "react"
import { MagnetColor } from "../../magnetronGameStyle"
import { Link } from "react-router-dom"
import { MagnetType } from "../../services/magnetronServerService/magnetronGameTypes"

export const Wrapper = styled.div`
    width: 100%;
    height: 100%;

    font-family: "Roboto", sans-serif;

    display: grid;
    grid-template-columns: 1fr minmax(300px, 1fr) 1fr;
    grid-template-rows: minmax(0, 1fr) 64px minmax(0, 1fr) minmax(0, 1fr) 64px;
    grid-template-areas:
        "title title title"
        "nav nav nav"
        ". join-game ."
        ". host-game ."
        ". . .";
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
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
`

export const HostGameButton = styled(Link)`
    box-sizing: border-box;
    max-width: 100%;
    max-height: 100%;
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.75);
    border-radius: 20px;
    background-color: ${MagnetColor[MagnetType.NEGATIVE]};
    padding: 20px 10%;
    border: none;
    outline: none;
    text-decoration: none;
    font-size: 32px;
    color: #ffffff;
    cursor: pointer;

    &:hover {
        background-color: ${MagnetColor[MagnetType.NEGATIVE]}b0;
    }
`
