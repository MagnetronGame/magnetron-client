import { MagAction, MagState, MagStatePlayerView } from "./magnetronGameTypes"

// export const apiAddress = "https://magnetron.no"
export const apiAddress = "http://localhost:8080"

const apiPrefix = "/api"
const apiUrl = `${apiAddress}${apiPrefix}`

type CreateGameResponse = {
    pin: string
    accessToken: string
}

type JoinGameResponse = {
    pin: string
    accessToken: string
    playerIndex: number
}

type Lobby = {
    playersCount: number
    players: string[]
}

export const createLobby = (): Promise<CreateGameResponse> =>
    fetch(`${apiUrl}/createLobby`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((pin) => pin as CreateGameResponse)

export const getLobby = (accessToken: string, pin: string, signal?: AbortSignal): Promise<Lobby> =>
    fetch(`${apiUrl}/lobby/${pin}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
        signal,
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((lobby) => lobby as Lobby)

export const startGame = (accessToken: string, pin: string): Promise<boolean> =>
    fetch(`${apiUrl}/startGame/${pin}`, {
        method: "POST",
        headers: { "Content-type": "application/json", Authorization: accessToken },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())

export const joinLobby = (pin: string, name: string): Promise<JoinGameResponse> =>
    fetch(`${apiUrl}/joinLobby/${pin}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: name,
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((resJ) => resJ as JoinGameResponse)

export const lobbyExists = (accessToken: string, pin: string): Promise<boolean> =>
    fetch(`${apiUrl}/lobbyExists/${pin}`, {
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
    fetch(`${apiUrl}/gameExists/${pin}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
        signal: signal,
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((exists) => exists as boolean)

export const gameState = (accessToken: string, pin: string): Promise<MagState> =>
    fetch(`${apiUrl}/gameState/${pin}`, {
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
    fetch(`${apiUrl}/gameState/${pin}/${playerIndex}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((res) => res || Promise.reject("Got no state: " + res))
        .then((gameState) => gameState as MagStatePlayerView)

export const possibleActions = (accessToken: string, pin: string): Promise<MagAction[]> =>
    fetch(`${apiUrl}/possibleActions/${pin}`, {
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
    fetch(`${apiUrl}/performAction/${pin}`, {
        method: "POST",
        headers: { "Content-type": "application/json", Authorization: accessToken },
        body: JSON.stringify(action),
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((state) => state as MagState)
