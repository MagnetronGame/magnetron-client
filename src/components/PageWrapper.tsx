import React from "react"
import styled from "styled-components"
import AdminBar from "./AdminBar"

type Props = React.PropsWithChildren<{
    development?: boolean
}>

const Wrapper = styled.div`
    height: 100vh;
`

const AdminBarWrapper = styled.div`
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
`

export default ({ children, development }: Props) => (
    <Wrapper>
        {development && (
            <AdminBarWrapper>
                <AdminBar />
            </AdminBarWrapper>
        )}
        {children}
    </Wrapper>
)
