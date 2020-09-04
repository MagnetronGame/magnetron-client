import React, { useEffect, useRef, useState } from "react"
import MagnetronMultiPage from "./MagnetronMultiPage"
import { useLocation, useRouteMatch } from "react-router-dom"
import { range } from "../../utils/arrayUtils"
import styled from "styled-components"

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
    const [url, setUrl] = useState<string | undefined>(undefined)

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
    const url = window.location.origin
    console.log(url)
    return (
        <MagnetronMultiPage
            hostPage={<GameFrame title={"Host"} src={url} />}
            clientsPage={range(4).map((i) => (
                <GameFrame title={`Client${i}`} src={url} />
            ))}
        />
    )
}

export default MagnetronTestAll
