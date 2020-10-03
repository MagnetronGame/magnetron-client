import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { FontSizes } from "../MagnetronTheme"

type ButtonType = "red" | "blue" | "lined"

type Props = React.PropsWithChildren<{
    className?: string
    style?: React.CSSProperties
    buttonType: ButtonType
    disabled?: boolean
    fontSize?: FontSizes
    linkTo?: string
    onClick?: (e: React.MouseEvent) => void
}>

export const BaseButtonColored = styled.button<{ buttonType: "red" | "blue"; fontSize: FontSizes }>`
    box-sizing: border-box;
    border-radius: 20px;
    background-color: ${(props) =>
        props.buttonType === "red"
            ? props.theme.magnet.positiveColor.standard
            : props.theme.magnet.negativeColor.standard};
    border: none;
    outline: none;
    text-decoration: none;
    font-size: ${(props) => props.theme.fonts.sizes[props.fontSize]};
    color: #ffffff;
    cursor: pointer;

    &:hover {
        background-color: ${(props) =>
            props.buttonType === "red"
                ? props.theme.magnet.positiveColor.standard
                : props.theme.magnet.negativeColor.standard}b0;
    }
`

const BaseButtonLined = styled.button<{ fontSize: FontSizes }>`
    outline: none;
    text-decoration: none;
    cursor: pointer;

    border-style: solid none;
    border-color: black;
    border-width: 3px;
    background-color: #ffffff44;
    color: black;
    font-size: ${(props) => props.theme.fonts.sizes[props.fontSize]};
    text-align: center;
    &:hover {
        background-color: #ffffff70;
    }
`

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`

const PaddingByFontSize: { [k in FontSizes]: string } = {
    small: "1px 10px",
    medium: "2px 15px",
    large: "5px 20px",
    largePlus: "5px 20px",
}

export default ({
    style,
    children,
    buttonType,
    linkTo,
    fontSize = "medium",
    ...baseButtonProps
}: Props) => {
    const _children = linkTo ? <StyledLink to={linkTo}>{children}</StyledLink> : children
    const customStyle = { padding: PaddingByFontSize[fontSize], ...style }
    return buttonType === "lined" ? (
        <BaseButtonLined style={customStyle} fontSize={fontSize} {...baseButtonProps}>
            {_children}
        </BaseButtonLined>
    ) : (
        <BaseButtonColored
            style={customStyle}
            fontSize={fontSize}
            buttonType={buttonType}
            {...baseButtonProps}
        >
            {_children}
        </BaseButtonColored>
    )
}
