import React, { useEffect, useRef, useState } from "react"
import MagnetronMultiPage from "./MagnetronMultiPage"
import { useLocation, useRouteMatch } from "react-router-dom"
import { range } from "../../utils/arrayUtils"
import styled from "styled-components"
import { setUseCookie } from "../../services/magnetronServerService/helpers"

const FrameWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const StyledIFrame = styled.iframe`
    flex-grow: 1;
    box-sizing: border-box;
`

const FrameHeader = styled.span`
    height: 32px;
`

const GameFrame: React.FC<{ title: string; src: string }> = ({ title, src }) => {
    const frameRef = useRef<HTMLIFrameElement>(null)
    const [url, setUrl] = useState<string | undefined>(window.location.href)

    useEffect(() => {
        if (frameRef.current) {
            frameRef.current.onload = (e) => {
                const url =
                    frameRef.current &&
                    frameRef.current.contentWindow &&
                    frameRef.current.contentWindow.location.href

                url && setUrl(url)
            }
        }
    })

    return (
        <FrameWrapper>
            {/*<FrameHeader>{url}</FrameHeader>*/}
            <StyledIFrame ref={frameRef} title={title} src={src} />
        </FrameWrapper>
    )
}

const MagnetronTestAll = () => {
    const [hostUrl, setHostUrl] = useState<string>(window.location.origin)
    const [clientsUrl, setClientsUrl] = useState<string[]>(range(4).map(() => hostUrl))
    const [inputPin, setInputPin] = useState<string>("")

    const handleClientsJoin = () => {
        setClientsUrl((curl) =>
            curl.map((_, index) => `client/lobby/join/${inputPin}?autoJoinName=frank${index}`),
        )
    }

    return (
        <MagnetronMultiPage
            hostPage={<GameFrame title={"Host"} src={hostUrl} />}
            clientsPage={clientsUrl.map((url, i) => (
                <GameFrame title={`Client${i}`} src={url} />
            ))}
        >
            <input
                value={inputPin}
                placeholder={"Clients pin"}
                onKeyDown={(e) => e.key === "Enter" && handleClientsJoin()}
                onChange={(e) => setInputPin(e.target.value)}
            />
        </MagnetronMultiPage>
    )
}

export default MagnetronTestAll
