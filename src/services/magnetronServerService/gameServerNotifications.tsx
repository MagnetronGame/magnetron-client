import { IFrame, Client, StompSubscription } from "@stomp/stompjs"
import * as api from "./gameServerApi"
import SockJS from "sockjs-client"
import { DependencyList, EffectCallback, useCallback, useEffect, useState } from "react"
import { frameCallbackType } from "@stomp/stompjs/esm5/types"
import { MagState, MagStatePlayerView } from "./magnetronGameTypes"

let socket = new SockJS(`${api.apiAddress}/magnetron-notify`)
let stompClient = new Client({
    webSocketFactory: () => socket,
})

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

const createServerNotificationHookWithPin = (path: string) => (
    pin: string,
    onNotification: EffectCallback,
    onSubscribed: () => void,
    deps: DependencyList,
) => useServerNotifications(`${path}/${pin}`, onNotification, onSubscribed, deps)

export const useLobbyNotification = createServerNotificationHookWithPin("/notify/lobby")

export const useLobbyGameReady = createServerNotificationHookWithPin("/notify/lobby/ready")

export const useGameStarted = createServerNotificationHookWithPin("/notify/game/started")

export const useGameStateUpdate = (
    accessToken: string,
    pin: string,
    clientType: "HOST" | number,
    onGameState: (state: MagState | MagStatePlayerView) => void,
    deps: DependencyList,
) => {
    const fetchGameState = useCallback(() => {
        clientType === "HOST"
            ? api.gameState(accessToken, pin).then((state) => onGameState(state))
            : api
                  .gameStatePlayerView(accessToken, pin, clientType)
                  .then((state) => onGameState(state))
    }, [accessToken, pin, onGameState, clientType])
    useServerNotifications(
        `/notify/game/state/${pin}`,
        () => fetchGameState(),
        () => fetchGameState(),
        deps,
    )
}

// useGameStateUpdate(
//     pin,
//     () => {
//         if (accessToken) {
//             if (role === "HOST") {
//                 api.gameState(accessToken, pin).then((_state) => setState(_state))
//             } else {
//                 api.gameStatePlayerView(accessToken, pin, role).then((_stateView) =>
//                     setState(_stateView.state),
//                 )
//             }
//         }
//     },
//     [accessToken, pin, role],
//     true,
// )
