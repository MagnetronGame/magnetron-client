import { MagAction, MagState, MagStatePlayerView } from "./magnetronGameTypes"
import { reconnect } from "./gameServerNotifications"

const ApiAddresses = {
    PUBLIC: "https://magnetron.no",
    LOCAL: "http://localhost:8080",
}

export type ApiAddressesType = keyof typeof ApiAddresses

let apiAddress: string = ApiAddresses.PUBLIC

export const setApiAddress = (type: ApiAddressesType) => {
    apiAddress = ApiAddresses[type]
    reconnect()
}

const apiPrefix = "/api"
export const baseUrl = () => apiAddress
export const apiBaseUrl = () => `${apiAddress}${apiPrefix}`

export const createLobby = (): Promise<CreateGameResponse> =>
    fetch(`${apiBaseUrl()}/createLobby`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((pin) => pin as CreateGameResponse)

export const getLobby = (accessToken: string, pin: string, signal?: AbortSignal): Promise<Lobby> =>
    fetch(`${apiBaseUrl()}/lobby/${pin}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
        signal,
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((lobby) => lobby as Lobby)

export const startGame = (accessToken: string, pin: string): Promise<boolean> =>
    fetch(`${apiBaseUrl()}/startGame/${pin}`, {
        method: "POST",
        headers: { "Content-type": "application/json", Authorization: accessToken },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())

export const joinLobby = (pin: string, name: string): Promise<JoinGameResponse> =>
    fetch(`${apiBaseUrl()}/joinLobby/${pin}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: name,
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((resJ) => resJ as JoinGameResponse)

export const lobbyExists = (accessToken: string, pin: string): Promise<boolean> =>
    fetch(`${apiBaseUrl()}/lobbyExists/${pin}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((exists) => exists as boolean)

export const gameExists = (
    accessToken: string,
    pin: string,
    signal?: AbortSignal,
): Promise<boolean> =>
    fetch(`${apiBaseUrl()}/gameExists/${pin}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
        signal: signal,
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((exists) => exists as boolean)

export const gameState = (accessToken: string, pin: string): Promise<MagState> =>
    fetch(`${apiBaseUrl()}/gameState/${pin}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((res) => res || Promise.reject("Got no state: " + res))
        .then((gameState) => gameState as MagState)

export const gameStatePlayerView = (
    accessToken: string,
    pin: string,
    playerIndex: number,
): Promise<MagStatePlayerView> =>
    fetch(`${apiBaseUrl()}/gameState/${pin}/${playerIndex}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((res) => res || Promise.reject("Got no state: " + res))
        .then((gameState) => gameState as MagStatePlayerView)

export const possibleActions = (accessToken: string, pin: string): Promise<MagAction[]> =>
    fetch(`${apiBaseUrl()}/possibleActions/${pin}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((actions) => actions as MagAction[])

export const performAction = (
    accessToken: string,
    pin: string,
    action: MagAction,
): Promise<MagState> =>
    fetch(`${apiBaseUrl()}/performAction/${pin}`, {
        method: "POST",
        headers: { "Content-type": "application/json", Authorization: accessToken },
        body: JSON.stringify(action),
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((state) => state as MagState)
