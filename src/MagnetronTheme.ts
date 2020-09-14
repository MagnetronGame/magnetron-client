import { MagnetType } from "./services/magnetronServerService/magnetronGameTypes"
import { shade } from "./utils/colors"

export type FontSizes = "small" | "medium" | "large" | "largePlus"

export type ColorTypes = {
    standard: string
    lighter: string
    darker: string
}

export type MagnetronThemeType = {
    fonts: {
        types: {
            standard: string
            cool: string
        }
        sizes: { [k in FontSizes]: string }
    }
    magnet: {
        baseColorInner: string
        baseColorOuter: string
        positiveColor: ColorTypes
        negativeColor: ColorTypes
        fakeColor: ColorTypes
        unknownColor: ColorTypes
    }
    coin: {
        colorInner: string
        colorOuter: string
    }
    board: {
        baseColor: string
        edgeColor: string
    }
}

const MagnetronTheme: MagnetronThemeType = {
    fonts: {
        types: {
            standard: "",
            cool: '"Krona One", sans-serif',
        },
        sizes: {
            largePlus: "36px",
            large: "32px",
            medium: "24px",
            small: "16px",
        },
    },
    magnet: {
        baseColorInner: "#8ca6a8",
        baseColorOuter: "#7B9095",
        positiveColor: {
            standard: "#ff3c2d",
            lighter: "#ff7e79",
            darker: "#c62e23",
        },
        negativeColor: {
            standard: "#433aff",
            lighter: "#817dff",
            darker: "#342dc6",
        },
        fakeColor: {
            standard: "#3b3b3b",
            lighter: shade(0.2, "#3b3b3b"),
            darker: shade(-0.2, "#3b3b3b"),
        },
        unknownColor: {
            standard: "#00000000",
            lighter: "#00000000",
            darker: "#00000000",
        },
    },
    coin: {
        colorInner: "#FFD700",
        colorOuter: "#DAA520",
    },
    board: {
        baseColor: "#fbffe8",
        edgeColor: "#6f84a6",
    },
}

export default MagnetronTheme

export const MagnetColorByType: Record<MagnetType, ColorTypes> = {
    [MagnetType.POSITIVE]: MagnetronTheme.magnet.positiveColor,
    [MagnetType.NEGATIVE]: MagnetronTheme.magnet.negativeColor,
    [MagnetType.FAKE]: MagnetronTheme.magnet.fakeColor,
    [MagnetType.UNKNOWN]: MagnetronTheme.magnet.unknownColor,
}
