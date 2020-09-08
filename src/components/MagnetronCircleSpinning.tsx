import React from "react"
import styled, { keyframes } from "styled-components"
import MagnetronCircle from "./MagnetronCircle"

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const MagnetronCircleSpinning = styled(MagnetronCircle)`
    animation: ${rotate} 5s linear infinite;
`

export default MagnetronCircleSpinning
