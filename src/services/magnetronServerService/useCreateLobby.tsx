import { useEffect, useState } from "react"
import * as lobbyApi from "./api/lobby"
import { cookies } from "../cookies"

type Return = {
    pin: string | undefined
}
export default (): Return => {
    const [pin, setPin] = useState<string | undefined>(undefined)

    useEffect(() => {
        lobbyApi.createLobby().then(({ pin: _pin, accessToken: _accessToken }) => {
            cookies.accessToken.set(_accessToken)
            setPin(_pin)
        })
    }, [])

    return {
        pin,
    }
}
