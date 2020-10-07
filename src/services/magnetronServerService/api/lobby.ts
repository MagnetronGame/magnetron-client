import { CreateLobbyResponse, JoinLobbyResponse, LobbySession } from "../types/serverTypes"
import { apiBaseUrl } from "./url"
import { stringifyQueryParams } from "../../../utils/queryParser"

const apiLobbyBaseUrl = () => `${apiBaseUrl()}/lobby`

export const createLobby = (): Promise<CreateLobbyResponse> =>
    fetch(`${apiLobbyBaseUrl()}/create`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((pin) => pin as CreateLobbyResponse)

export const getLobby = (
    accessToken: string,
    pin: string,
    signal?: AbortSignal,
): Promise<LobbySession> =>
    fetch(`${apiLobbyBaseUrl()}/${pin}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
        signal,
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((lobby) => lobby as LobbySession)

export const startGame = (accessToken: string, pin: string): Promise<boolean> =>
    fetch(`${apiLobbyBaseUrl()}/start/${pin}`, {
        method: "POST",
        headers: { "Content-type": "application/json", Authorization: accessToken },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())

export const joinLobby = (pin: string, name: string): Promise<JoinLobbyResponse> =>
    fetch(`${apiLobbyBaseUrl()}/join/${pin}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: name,
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((resJ) => resJ as JoinLobbyResponse)

export const joinLobbyBot = (
    pin: string,
    name: string,
    botLevel: number,
): Promise<JoinLobbyResponse> =>
    fetch(`${apiLobbyBaseUrl()}/join/${pin}${stringifyQueryParams({ type: "bot", botLevel })}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: name,
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((resJ) => resJ as JoinLobbyResponse)

export const lobbyExists = (pin: string): Promise<boolean> =>
    fetch(`${apiLobbyBaseUrl()}/exists/${pin}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((exists) => exists as boolean)
