import { MagnetType } from "./services/magnetronServerService/magnetronGameTypes"

export const MagnetColor: Record<MagnetType, string> = {
    [MagnetType.POSITIVE]: "#ff3c2d",
    [MagnetType.NEGATIVE]: "#433aff",
    [MagnetType.FAKE]: "#3b3b3b",
    [MagnetType.UNKNOWN]: "#000000",
}
