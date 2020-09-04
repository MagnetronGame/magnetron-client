import { useEffect, useState } from "react"
import * as api from "./gameServerApi"
import { setAccessTokenCookie } from "./helpers"

type Return = {
    pin: string | undefined
}
export default (): Return => {
    const [pin, setPin] = useState<string | undefined>(undefined)

    useEffect(() => {
        api.createLobby().then(({ pin: _pin, accessToken: _accessToken }) => {
            setAccessTokenCookie(_accessToken)
            setPin(_pin)
        })
    }, [])

    return {
        pin,
    }
}
