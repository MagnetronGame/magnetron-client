import React, { useEffect, useRef, useState } from "react"
import MagnetronMultiPage from "./MagnetronMultiPage"
import { range } from "../../utils/arrayUtils"
import styled from "styled-components"
import { parseQueryParams, stringifyQueryParams } from "../../utils/queryParser"
import { MagAction, MagState } from "../../services/magnetronServerService/magnetronGameTypes"
import { useLocation } from "react-router-dom"

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

const createUrl = (
    hostClient: "host" | number,
    subPath?: string,
    queryParams?: { [k: string]: any },
) =>
    `${window.location.origin}${subPath || ""}` +
    stringifyQueryParams(
        { cookiePrefix: hostClient === "host" ? "test-host" : `test-client${hostClient}` },
        queryParams ? queryParams : {},
    )

const magStateFromStr = (actionStr: string): MagAction => ({
    handPieceIndex: parseInt(actionStr[0]),
    boardPosition: { x: parseInt(actionStr[1]), y: parseInt(actionStr[2]) },
})

// prettier-ignore
const clientsInitialActionBuffer: MagAction[][] = [
    ["003", "001", "010",   "000", "040", "010"],
    ["014", "034", "041",   "032", "021", "011"],
    ["030", "021", "043",   "043", "003", "012"],
    ["032", "031", "033",   "044", "014", "004"],
].map((actions) => actions.map(magStateFromStr))

const clientCount = 4
const clientsRange = range(clientCount)

const ControlPanelWrapper = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const MagnetronTestAll = () => {
    const { actions: inputPredefinedActions } = parseQueryParams(useLocation().search)
    const [hostUrl, setHostUrl] = useState<string>(createUrl("host", "/host/lobby/create"))
    const [clientsUrl, setClientsUrl] = useState<string[]>(
        clientsRange.map((index) => createUrl(index)),
    )
    const hostFrameRef = useRef<HTMLIFrameElement>(null)
    const [inputPin, setInputPin] = useState<string>("")

    const [clientsActionBuffer, setClientsActionBuffer] = useState<MagAction[][]>(
        inputPredefinedActions ? clientsInitialActionBuffer : clientsRange.map(() => []),
    )

    useEffect(() => {
        if (hostFrameRef.current) {
            const frame = hostFrameRef.current
            const handle = setInterval(() => {
                if (frame && frame.contentWindow) {
                    const hostPinElem = frame.contentWindow.document.querySelector("#showPin")
                    if (hostPinElem !== null) {
                        const _pin = hostPinElem.innerHTML
                        setInputPin(_pin)
                        handleClientsJoin(_pin)
                        clearInterval(handle)
                    }
                }
            }, 500)
        }
    }, [hostFrameRef])

    const setClientIndexUrl = (index: number, url: string) =>
        setClientsUrl((prevUrls) => [
            ...prevUrls.slice(0, index),
            url,
            ...prevUrls.slice(index + 1),
        ])

    const gotoGameWithActionsBuffer = (_inputPin: string = inputPin): void => {
        clientsRange.forEach((index) => {
            if (clientsActionBuffer[index].length > 0) {
                const gameUrl = createUrl(index, `/client/game/${_inputPin}/${index}`, {
                    actionsBuffer: JSON.stringify(clientsActionBuffer[index]),
                })
                setClientIndexUrl(index, gameUrl)
            }
        })
    }

    const handleClientsJoin = (_inputPin: string = inputPin) => {
        clientsRange.forEach((index) => {
            const joinUrl = createUrl(index, `/client/lobby/join/${_inputPin}`, {
                autoJoinName: `frank${index}`,
            })
            // delayed to make the playerIndex consistent with the client index
            setTimeout(() => setClientIndexUrl(index, joinUrl), 500 * index)
        })

        setTimeout(() => gotoGameWithActionsBuffer(_inputPin), 5000)
    }

    return (
        <MagnetronMultiPage
            hostPage={
                <FrameWrapper>
                    <StyledIFrame
                        ref={hostFrameRef}
                        title={"Host"}
                        src={hostUrl}
                        allow={"autoplay"}
                    />
                </FrameWrapper>
            }
            clientsPage={clientsUrl.map((url, i) => (
                <GameFrame title={`Client${i}`} src={url} />
            ))}
        >
            <ControlPanelWrapper>
                <input
                    value={inputPin}
                    placeholder={"Clients pin"}
                    onKeyDown={(e) => e.key === "Enter" && handleClientsJoin()}
                    onChange={(e) => setInputPin(e.target.value)}
                />
            </ControlPanelWrapper>
        </MagnetronMultiPage>
    )
}

export default MagnetronTestAll
