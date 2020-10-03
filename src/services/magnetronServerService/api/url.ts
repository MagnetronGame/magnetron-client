import { reconnect } from "../gameServerNotifications"

const ApiAddresses = {
    PUBLIC: "https://magnetron.no",
    LOCAL: "http://localhost:8080",
}

let apiAddress: string = ApiAddresses.PUBLIC

export type ApiAddressesType = keyof typeof ApiAddresses

export const setApiAddress = (type: ApiAddressesType) => {
    apiAddress = ApiAddresses[type]
    reconnect()
}

const apiPrefix = "/api"
export const baseUrl = () => apiAddress
export const apiBaseUrl = () => `${apiAddress}${apiPrefix}`
