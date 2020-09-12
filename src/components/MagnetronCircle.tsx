import React, { CSSProperties } from "react"
import { MagnetronTheme } from "../magnetronGameStyle"
import styled, { keyframes } from "styled-components"

const MagnetronCircleSvg: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
    className,
    style,
}) => {
    return (
        // prettier-ignore
        <svg width="100%" height="100%" viewBox="0 0 136 136" fill="none" xmlns="http://www.w3.org/2000/svg"
             className={className} style={style}
        >
            <path d="M136 68C136 59.0701 134.241 50.2277 130.824 41.9775C127.406 33.7274 122.398 26.2311 116.083 19.9167C109.769 13.6024 102.273 8.59351 94.0225 5.17619C85.7723 1.75887 76.9299 -3.90338e-07 68 0L68 23.5888C73.8322 23.5888 79.6072 24.7375 84.9954 26.9694C90.3837 29.2013 95.2795 32.4726 99.4035 36.5965C103.527 40.7205 106.799 45.6163 109.031 51.0046C111.262 56.3928 112.411 62.1678 112.411 68H136Z"
                  fill={MagnetronTheme.magnet.positiveColor.darker}
            />
            <path d="M68 136C76.9299 136 85.7723 134.241 94.0225 130.824C102.273 127.406 109.769 122.398 116.083 116.083C122.398 109.769 127.406 102.273 130.824 94.0225C134.241 85.7723 136 76.9299 136 68H112.411C112.411 73.8322 111.262 79.6072 109.031 84.9954C106.799 90.3837 103.527 95.2795 99.4035 99.4035C95.2795 103.527 90.3837 106.799 84.9954 109.031C79.6072 111.262 73.8322 112.411 68 112.411L68 136Z"
                  fill={MagnetronTheme.magnet.baseColorOuter}
            />
            <path d="M0 68C-7.80675e-07 76.9299 1.75887 85.7723 5.17619 94.0225C8.59351 102.273 13.6024 109.769 19.9167 116.083C26.2311 122.398 33.7274 127.406 41.9775 130.824C50.2277 134.241 59.0701 136 68 136L68 112.411C62.1678 112.411 56.3928 111.262 51.0046 109.031C45.6163 106.799 40.7205 103.527 36.5965 99.4035C32.4726 95.2795 29.2013 90.3837 26.9694 84.9954C24.7375 79.6072 23.5888 73.8322 23.5888 68L0 68Z"
                fill={MagnetronTheme.magnet.negativeColor.darker}
            />
            <path d="M68 0C59.0701 -1.06488e-07 50.2277 1.75887 41.9775 5.17619C33.7274 8.59351 26.2311 13.6024 19.9167 19.9167C13.6024 26.2311 8.59351 33.7274 5.17619 41.9775C1.75887 50.2277 -1.34837e-06 59.0701 0 68L23.5888 68C23.5888 62.1678 24.7375 56.3928 26.9694 51.0046C29.2012 45.6163 32.4726 40.7205 36.5965 36.5965C40.7205 32.4726 45.6163 29.2013 51.0046 26.9694C56.3928 24.7375 62.1678 23.5888 68 23.5888L68 0Z"
                  fill={MagnetronTheme.coin.colorOuter}
            />
            <path d="M132 68C132 59.5954 130.345 51.2731 127.128 43.5083C123.912 35.7434 119.198 28.6881 113.255 22.7452C107.312 16.8022 100.257 12.088 92.4917 8.87171C84.7269 5.65541 76.4046 4 68 4L68 26.2012C73.4891 26.2012 78.9244 27.2824 83.9957 29.3829C89.067 31.4835 93.6748 34.5624 97.5562 38.4438C101.438 42.3252 104.516 46.933 106.617 52.0043C108.718 57.0756 109.799 62.5109 109.799 68H132Z"
                  fill={MagnetronTheme.magnet.positiveColor.standard}
            />
            <path d="M68 132C76.4046 132 84.7269 130.345 92.4917 127.128C100.257 123.912 107.312 119.198 113.255 113.255C119.198 107.312 123.912 100.257 127.128 92.4917C130.345 84.7269 132 76.4046 132 68L109.799 68C109.799 73.4891 108.718 78.9244 106.617 83.9957C104.516 89.067 101.438 93.6748 97.5562 97.5562C93.6748 101.438 89.067 104.516 83.9957 106.617C78.9244 108.718 73.4891 109.799 68 109.799L68 132Z"
                  fill={MagnetronTheme.magnet.baseColorInner}
            />
            <path d="M68 4C59.5954 4 51.2731 5.65541 43.5083 8.87171C35.7434 12.088 28.6881 16.8022 22.7452 22.7452C16.8022 28.6881 12.088 35.7434 8.87171 43.5083C5.65541 51.2731 4 59.5954 4 68L26.2012 68C26.2012 62.5109 27.2824 57.0756 29.3829 52.0043C31.4835 46.933 34.5624 42.3252 38.4438 38.4438C42.3252 34.5624 46.933 31.4835 52.0043 29.3829C57.0756 27.2824 62.5109 26.2012 68 26.2012L68 4Z"
                  fill={MagnetronTheme.coin.colorInner}
            />
            <path d="M4 68C4 76.4046 5.65541 84.7269 8.87171 92.4917C12.088 100.257 16.8022 107.312 22.7452 113.255C28.6881 119.198 35.7434 123.912 43.5083 127.128C51.2731 130.345 59.5954 132 68 132L68 109.799C62.5109 109.799 57.0756 108.718 52.0043 106.617C46.933 104.516 42.3252 101.438 38.4438 97.5562C34.5624 93.6748 31.4835 89.067 29.3829 83.9957C27.2824 78.9244 26.2012 73.4891 26.2012 68L4 68Z"
                  fill={MagnetronTheme.magnet.negativeColor.standard}
            />
            <g filter="url(#filter0_d)">
                <path d="M32.0654 35.4189H44.7578L67.5 58.2412L90.2422 35.4189H102.935V98H90.2422V52.9961L67.5 74.8975L44.7578 52.9961V98H32.0654V35.4189Z" fill="black"/>
            </g>
            <defs>
                <filter id="filter0_d" x="28.0654" y="33.4189" width="78.8691" height="70.5811" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                    <feOffset dy="2"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
            </defs>
        </svg>
    )
}

const rotateFrame = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const MagnetronCircleSpinning = styled(MagnetronCircleSvg)<{ roundTime: number }>`
    animation: ${rotateFrame} ${(props) => props.roundTime}s linear infinite;
`

const CircleCenterWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

type Props = {
    className?: string
    style?: CSSProperties
    size: "small%" | "full%"
    rotation?: "slow" | "medium" | "fast"
}
const sizePercent = { "small%": "30%", "full%": "90%" }
const rotateTime = { slow: 6, medium: 4, fast: 2 }

export default ({ className, style, size, rotation }: Props) => {
    const circleStyle = { width: sizePercent[size], height: sizePercent[size] }
    return (
        <CircleCenterWrapper className={className} style={style}>
            {rotation ? (
                <MagnetronCircleSpinning roundTime={rotateTime[rotation]} style={circleStyle} />
            ) : (
                <MagnetronCircleSvg style={circleStyle} />
            )}
        </CircleCenterWrapper>
    )
}
