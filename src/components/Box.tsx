import React from "react"
import styled from "styled-components"

type Props = {
    type: "red" | "blue"
}

export default styled.div<Props>`
    box-sizing: border-box;
    box-shadow: 1px 1px 2px 0px rgba(0, 0, 0, 0.75);

    background-color: ${(props) =>
        props.type === "red"
            ? props.theme.magnet.positiveColor.standard
            : props.theme.magnet.negativeColor.standard};
    border-radius: 20px;
    font-size: 32px;
    color: white;
    padding: 20px 20px;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`
