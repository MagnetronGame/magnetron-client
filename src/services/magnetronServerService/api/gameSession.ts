import { GameId, GameStateView } from "../types/serverTypes"
import { MagAction } from "../types/gameTypes/actionTypes"
import { apiBaseUrl } from "./url"

export const apiGameBaseUrl = () => `${apiBaseUrl()}/game`

export const gameExists = (gameId: GameId, signal?: AbortSignal): Promise<boolean> =>
    fetch(`${apiGameBaseUrl()}/exists/${gameId}`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
        signal: signal,
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((exists) => exists as boolean)

export const gameState = (accessToken: string, gameId: GameId): Promise<GameStateView> =>
    fetch(`${apiGameBaseUrl()}/state/${gameId}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((res) => res || Promise.reject("Got no state: " + res))
        .then((gameState) => gameState as GameStateView)

export const gameStateForPlayer = (
    accessToken: string,
    gameId: GameId,
    playerIndex: number,
): Promise<GameStateView> =>
    fetch(`${apiGameBaseUrl()}/state/${gameId}/${playerIndex}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((res) => res || Promise.reject("Got no state: " + res))
        .then((gameState) => gameState as GameStateView)

export const possibleActions = (accessToken: string, gameId: GameId): Promise<MagAction[]> =>
    fetch(`${apiGameBaseUrl()}/possibleActions/${gameId}`, {
        method: "GET",
        headers: { "Content-type": "application/json", Authorization: accessToken },
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((actions) => actions as MagAction[])

export const performAction = (
    accessToken: string,
    gameId: GameId,
    action: MagAction,
): Promise<Boolean> =>
    fetch(`${apiGameBaseUrl()}/performAction/${gameId}`, {
        method: "POST",
        headers: { "Content-type": "application/json", Authorization: accessToken },
        body: JSON.stringify(action),
    })
        .then((res) => (res.ok ? res : Promise.reject(res)))
        .then((res) => res.json())
        .then((success) => success as boolean)
