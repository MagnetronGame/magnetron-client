import { useEffect, useState } from "react"
import Cookies from "universal-cookie"
import * as api from "./gameServerApi"

const cookies = new Cookies("all")

export const getAccessTokenCookie = (): string | undefined =>
    cookies.get("access-token") as string | undefined

export const setAccessTokenCookie = (accessToken: string | undefined) => {
    cookies.set("access-token", accessToken, { path: "/" })
}

export const useGameAccessible = (
    gameState: "LOBBY" | "GAME",
    pin: string | undefined,
    accessToken: string | undefined,
): boolean | undefined => {
    const [gameAccessible, setGameAccessible] = useState<boolean | undefined>(undefined)
    useEffect(() => {
        if (accessToken && pin) {
            // setGameAccessible(undefined) //TODO: this may happen after the next check
            const apiCall: (accessToken: string, pin: string) => Promise<boolean> =
                gameState === "LOBBY" ? api.lobbyExists : api.gameExists
            apiCall(accessToken, pin)
                .then((exists) => setGameAccessible(exists))
                .catch((err) => setGameAccessible(false))
        }
    }, [accessToken, pin, gameState])

    return gameAccessible
}
