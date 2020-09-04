import { IFrame, Client } from "@stomp/stompjs"
import { apiAddress } from "./gameServerApi"
import SockJS from "sockjs-client"
import { useEffect, useState } from "react"
import { frameCallbackType } from "@stomp/stompjs/esm5/types"

let socket = new SockJS(`${apiAddress}/magnetron-notify`)
let stompClient = new Client({
    webSocketFactory: () => socket,
})

const onConnectCallbacks: frameCallbackType[] = []
const onDisconnectCallbacks: frameCallbackType[] = []

stompClient.onConnect = (frame: IFrame) => {
    console.log("WS connected! :)")
    onConnectCallbacks.forEach((callback) => callback(frame))
}
stompClient.onDisconnect = (frame: IFrame) => {
    console.log("WS disconnected :(")
    onDisconnectCallbacks.forEach((callback) => callback(frame))
}

stompClient.onStompError = (frame: IFrame) => console.error("STOMP client error: ", frame)

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
    onNotification: () => void,
    notifyImmediately?: boolean,
) => {
    const [connected, setConnected] = useState<boolean>(stompClient.connected)

    useOnConnect(() => setConnected(true))
    useOnDisconnect(() => setConnected(false))

    useEffect(() => {
        if (connected) {
            stompClient.subscribe(
                path,
                () => {
                    console.log("Got notification for", path)
                    onNotification()
                },
                { Authorization: "hei" },
            )
            console.log("Subscribed to:", path)
        }

        return () => {
            if (connected) {
                stompClient.unsubscribe(path)
                console.log("Unsubscribed from:", path)
            }
        }
    }, [connected, path, onNotification])

    useEffect(() => {
        if (notifyImmediately) {
            onNotification()
        }
    }, [])
}

const createServerNotificationHookWithPin = (path: string) => (
    pin: string,
    onNotification: () => void,
    notifyImmediately?: boolean,
) => useServerNotifications(`${path}/${pin}`, onNotification, notifyImmediately)

export const useLobbyNotification = createServerNotificationHookWithPin("/notify/lobby")

export const useLobbyGameReady = createServerNotificationHookWithPin("/notify/lobby/ready")

export const useGameStarted = createServerNotificationHookWithPin("/notify/game/started")

export const useGameStateUpdate = createServerNotificationHookWithPin("/notify/game/state")
