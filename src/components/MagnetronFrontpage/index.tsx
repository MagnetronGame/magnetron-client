import React from "react"
import {
    AppWrapper,
    HostGameArea,
    HostGameButton,
    JoinGameArea,
    NavBarArea,
    SeeBelowArea,
    StyledMagnetronHowTo,
    Title,
    TitleArea,
    Wrapper,
} from "./elements"
import JoinGameBox from "./JoinGameBox"
import Button from "../Button"

const MagnetronFrontpage = () => {
    return (
        <Wrapper>
            <AppWrapper>
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
                    <HostGameButton
                        buttonType={"blue"}
                        fontSize={"large"}
                        linkTo={"/host/lobby/create"}
                    >
                        Host game &rArr;
                    </HostGameButton>
                </HostGameArea>
                <SeeBelowArea>
                    How to play
                    <br />
                    &dArr;
                </SeeBelowArea>
            </AppWrapper>
            <StyledMagnetronHowTo />
        </Wrapper>
    )
}

export default MagnetronFrontpage
