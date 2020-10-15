import styled from "styled-components"

export const Wrapper = styled.div`
    width: 100%;
    height: 100%;
`

export const GameOverlay = styled.div<{ color?: string }>`
    background-color: ${(props) => props.color || "none"};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`

export const GameRootNode = styled.div`
    width: 100%;
    height: 100%;
`

export const PlayerAvatarField = styled.div<{ x: number; y: number }>`
    position: absolute;
    color: white;
    top: ${(props) => props.y - 8}px;
    left: ${(props) => props.x - 8}px;
    font-family: ${(props) => props.theme.fonts.types.cool};
    font-size: 16px;
`

export const WinnerField = styled.div<{ color: string }>`
    width: 100%;
    height: 100%;
    color: ${(props) => props.color};
    font-family: ${(props) => props.theme.fonts.types.cool};
    font-size: ${(props) => props.theme.fonts.sizes.large};
    display: flex;
    justify-content: center;
    align-items: start;
`
