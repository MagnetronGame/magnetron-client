import { Access } from "./helpers"
import { useEffect, useState } from "react"
import * as api from "./gameServerApi"
import { cookies } from "../cookies"

export default (pin: string): Access => {
    const accessToken = cookies.accessToken.get()
    const [gameExists, setGameExists] = useState<"CHECKING" | "NO" | "YES">("CHECKING")
    const [gameCreated, setGameCreated] = useState<"NOT_ATTEMPTED" | "YES" | "NO">("NOT_ATTEMPTED")
    const [gameAccess, setGameAccess] = useState<Access>(
        accessToken ? Access.CHECKING : Access.NOT_ACCESSIBLE,
    )

    useEffect(() => {
        if (accessToken && gameExists === "CHECKING") {
            api.gameExists(accessToken, pin)
                .then((exists) => setGameExists(exists ? "YES" : "NO"))
                .catch(() => setGameExists("NO"))
        }
    }, [pin, accessToken, gameExists])

    useEffect(() => {
        if (accessToken && gameExists === "NO" && gameCreated === "NOT_ATTEMPTED") {
            api.startGame(accessToken, pin)
                .then((created) => setGameCreated(created ? "YES" : "NO"))
                .catch(() => setGameCreated("NO"))
        }
    }, [accessToken, pin, gameExists, gameCreated])

    useEffect(() => {
        if (gameExists === "YES" || gameCreated === "YES") {
            setGameAccess(Access.ACCESSIBLE)
        } else if (gameExists === "NO" && gameCreated === "NO") {
            setGameAccess(Access.NOT_ACCESSIBLE)
        }
    }, [gameExists, gameCreated])

    return gameAccess
}
