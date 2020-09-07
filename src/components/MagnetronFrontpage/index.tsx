import React from "react"
import {
    HostGameArea,
    HostGameButton,
    JoinGameArea,
    NavBarArea,
    Title,
    TitleArea,
    Wrapper,
} from "./elements"
import JoinGameBox from "./JoinGameBox"

const MagnetronFrontpage = () => {
    return (
        <Wrapper>
            <TitleArea>
                <Title />
            </TitleArea>
            <NavBarArea>
                <span>About</span>
                <span>Contact</span>
            </NavBarArea>
            <JoinGameArea>
                <JoinGameBox></JoinGameBox>
            </JoinGameArea>
            <HostGameArea>
                <HostGameButton to={"/host/lobby/create"}>Host game &rArr;</HostGameButton>
            </HostGameArea>
        </Wrapper>
    )
}

export default MagnetronFrontpage
