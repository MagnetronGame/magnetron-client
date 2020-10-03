import React, { DependencyList, EffectCallback, useCallback, useEffect, useState } from "react"
import { IFrame, Client, StompSubscription } from "@stomp/stompjs"
import * as apiUrl from "./api/url"
import * as lobbyApi from "./api/lobby"
import * as gameApi from "./api/gameSession"
import SockJS from "sockjs-client"
import { frameCallbackType } from "@stomp/stompjs/esm5/types"
import { GameId, GameStateView, LobbySession } from "./types/serverTypes"

let stompClient = new Client({
    webSocketFactory: () => new SockJS(`${apiUrl.apiBaseUrl()}/notify`),
})

export const reconnect = () => {
    stompClient.deactivate()
    stompClient.activate()
}

const onConnectCallbacks: frameCallbackType[] = []
const onDisconnectCallbacks: frameCallbackType[] = []

stompClient.onConnect = (frame: IFrame) => {
    onConnectCallbacks.forEach((callback) => callback(frame))
}
stompClient.onDisconnect = (frame: IFrame) => {
    onDisconnectCallbacks.forEach((callback) => callback(frame))
}

stompClient.onStompError = (frame: IFrame) => console.error("STOMP client error: ", frame)
stompClient.onWebSocketError = (event) => console.error("WS error: ", event)

stompClient.activate()

const useOnConnect = (callback: frameCallbackType) => {
    useEffect(() => {
        const _callback = callback
        onConnectCallbacks.push(_callback)
        return () => {
            const callbackIndex = onConnectCallbacks.indexOf(_callback)
            onConnectCallbacks.splice(callbackIndex, 1)
        }
    })
}

const useOnDisconnect = (callback: frameCallbackType) => {
    useEffect(() => {
        const _callback = callback
        onDisconnectCallbacks.push(_callback)
        return () => {
            const callbackIndex = onDisconnectCallbacks.indexOf(_callback)
            onDisconnectCallbacks.splice(callbackIndex, 1)
        }
    })
}

const useServerNotifications = (
    path: string,
    onNotification: EffectCallback,
    onSubscribed: () => void,
    deps: DependencyList,
) => {
    const [connected, setConnected] = useState<boolean>(stompClient.connected)

    useOnConnect(() => setConnected(true))
    useOnDisconnect(() => setConnected(false))

    const _onNotification = useCallback(onNotification, deps)
    const _onSubscribed = useCallback(onSubscribed, deps)

    useEffect(() => {
        if (connected) {
            let notificationCleanup: void | (() => void | undefined)
            const subscription = stompClient.subscribe(
                path,
                (message) => {
                    const { body } = message
                    if (body === "subscribed") {
                        _onSubscribed()
                    } else {
                        notificationCleanup = _onNotification()
                    }
                },
                {},
            )
            return () => {
                if (subscription && stompClient.connected) {
                    subscription.unsubscribe()
                }
                if (notificationCleanup) {
                    notificationCleanup()
                }
            }
        }
    }, [connected, path, _onNotification, _onSubscribed])
}

export const useLobbyUpdate = (
    accessToken: string,
    pin: string,
    onLobby: (lobby: LobbySession) => void,
) => {
    const fetchLobby = useCallback(() => {
        lobbyApi.getLobby(accessToken, pin).then((lobby) => onLobby(lobby))
    }, [accessToken, pin, onLobby])

    useServerNotifications(
        `/notify/lobby/${pin}`,
        () => fetchLobby(),
        () => fetchLobby(),
        [],
    )
}

export const useGameStateUpdate = (
    accessToken: string,
    gameId: GameId,
    clientType: "HOST" | number,
    onGameState: (stateView: GameStateView) => void,
    deps: DependencyList,
) => {
    const fetchGameState = useCallback(() => {
        const fetchPromise =
            clientType === "HOST"
                ? gameApi.gameState(accessToken, gameId)
                : gameApi.gameStateForPlayer(accessToken, gameId, clientType)
        fetchPromise.then((state) => onGameState(state))
    }, [accessToken, gameId, onGameState, clientType])

    useServerNotifications(
        `/notify/game/state/${gameId}`,
        () => fetchGameState(),
        () => fetchGameState(),
        deps,
    )
}
