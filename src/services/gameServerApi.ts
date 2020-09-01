import { MagAction, MagState } from "./magnetronGameTypes"

const apiAddress = "http://localhost:8080"
const apiPrefix = "/api"
const apiUrl = `${apiAddress}${apiPrefix}`

export const createGame = (): Promise<string> =>
    fetch(`${apiUrl}/createGame`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
    })
        .then((res) => res.json())
        .then((resJ) => (resJ.ok ? resJ : Promise.reject(resJ)))
        .then((pin) => {
            console.dir("Pin: " + pin)
            return pin
        })
        .then((pin) => pin as string)
        .then((pin) => (pin.length === 4 ? pin : Promise.reject("invalid pin")))

export const gameState = (pin: string): Promise<MagState> =>
    fetch(`${apiUrl}/gameState/${pin}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
    })
        .then((res) => res.json())
        .then((resJ) => (resJ.ok ? resJ : Promise.reject(resJ)))
        .then((gameState) => gameState as MagState)

export const possibleActions = (pin: string): Promise<MagAction[]> =>
    fetch(`${apiUrl}/possibleActions/${pin}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
    })
        .then((res) => res.json())
        .then((resJ) => (resJ.ok ? resJ : Promise.reject(resJ)))
        .then((actions) => actions as MagAction[])

export const performAction = (pin: string, action: MagAction): Promise<MagState> =>
    fetch(`${apiUrl}/performAction/${pin}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(action),
    })
        .then((res) => res.json())
        .then((resJ) => (resJ.ok ? resJ : Promise.reject(resJ)))
        .then((state) => state as MagState)
