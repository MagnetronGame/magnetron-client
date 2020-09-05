import { useEffect, useState } from "react"
import Cookies from "universal-cookie"
import * as api from "./gameServerApi"

let useCookie: boolean = false

// Set to false to only allow accessToken in memory
export const setUseCookie = (value: boolean) => {
    useCookie = value
}

const cookies = new Cookies("all")

let storedAccessToken: string | undefined = undefined

export const getAccessTokenCookie = (): string | undefined =>
    useCookie ? (cookies.get("access-token") as string | undefined) : storedAccessToken

export const setAccessTokenCookie = (accessToken: string | undefined) => {
    useCookie
        ? cookies.set("access-token", accessToken, { path: "/" })
        : (storedAccessToken = accessToken)
}

export enum Access {
    CHECKING = "CHECKING",
    ACCESSIBLE = "ACCESSIBLE",
    NOT_ACCESSIBLE = "NOT_ACCESSIBLE",
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
