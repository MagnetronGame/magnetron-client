import React, { ReactNode } from "react"
import styled from "styled-components"

const SCREEN_SIZES = {
    "Galaxy S5": { x: 360, y: 640 },
}

const SCREEN_TYPE = "Galaxy S5"

const SCREEN_SIZE = SCREEN_SIZES[SCREEN_TYPE]

const Wrapper = styled.div`
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: 2fr repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-template-areas:
        "other client1 client2"
        "host client3 client4";
`

type Props = {
    hostPage: ReactNode
    clientsPage: ReactNode[]
}

const MagnetronMultiPage: React.FC<React.PropsWithChildren<Props>> = ({
    children,
    hostPage,
    clientsPage,
}) => {
    return (
        <Wrapper>
            <div style={{ gridArea: "other" }}>{children}</div>
            <div style={{ gridArea: "host" }}>{hostPage}</div>
            {clientsPage.map((clientPage, index) => (
                <div key={index} style={{ gridArea: `client${index + 1}` }}>
                    {clientPage}
                </div>
            ))}
        </Wrapper>
    )
}

export default MagnetronMultiPage
