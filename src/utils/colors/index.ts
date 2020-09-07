import { pSBC } from "./pSBC"

export const shade = (percent: number, color: string): string => pSBC(percent, color) as string
export const blend = (percent: number, color1: string, color2: string): string =>
    pSBC(percent, color1, color2) as string
