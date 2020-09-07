import { IFrame, Client, StompSubscription } from "@stomp/stompjs"
import { apiAddress } from "./gameServerApi"
import SockJS from "sockjs-client"
import { DependencyList, EffectCallback, useCallback, useEffect, useState } from "react"
import { frameCallbackType } from "@stomp/stompjs/esm5/types"

let socket = new SockJS(`${apiAddress}/magnetron-notify`)
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
    deps: DependencyList,
    notifyImmediately?: boolean,
) => {
    const [connected, setConnected] = useState<boolean>(stompClient.connected)

    useOnConnect(() => setConnected(true))
    useOnDisconnect(() => setConnected(false))

    const _onNotification = useCallback(onNotification, deps)

    useEffect(() => {
        if (connected) {
            let notificationCleanup: void | (() => void | undefined)
            const subscription = stompClient.subscribe(
                path,
                () => (notificationCleanup = _onNotification()),
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
    }, [connected, path, _onNotification])

    useEffect(() => {
        if (notifyImmediately) {
            onNotification()
        }
    }, [])
}

const createServerNotificationHookWithPin = (path: string) => (
    pin: string,
    onNotification: EffectCallback,
    deps: DependencyList,
    notifyImmediately?: boolean,
) => useServerNotifications(`${path}/${pin}`, onNotification, deps, notifyImmediately)

export const useLobbyNotification = createServerNotificationHookWithPin("/notify/lobby")

export const useLobbyGameReady = createServerNotificationHookWithPin("/notify/lobby/ready")

export const useGameStarted = createServerNotificationHookWithPin("/notify/game/started")

export const useGameStateUpdate = createServerNotificationHookWithPin("/notify/game/state")
