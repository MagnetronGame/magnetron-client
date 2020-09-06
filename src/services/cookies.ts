import Cookies from "universal-cookie"

let useCookie: boolean = true
let cookiePrefix: string | null = null

// Set to false to only allow accessToken in memory
export const setUseCookie = (value: boolean) => {
    useCookie = value
}

// Set the path used for the cookie,
export const setCookiePrefix = (prefix?: string) => {
    cookiePrefix = prefix || null
}

const cookiesContext = new Cookies()

// used if useCookie === false
let memoryCookies: { [k: string]: string } = {}

const appendCookiePrefix = (cookie: string) => (cookiePrefix ? `${cookiePrefix}-${cookie}` : cookie)

const createSpecificCookieMethods = (
    cookie: string,
): {
    get: () => string | undefined
    set: (value: string) => void
} => ({
    get: () =>
        useCookie
            ? (cookiesContext.get(appendCookiePrefix(cookie)) as string | undefined)
            : memoryCookies[appendCookiePrefix(cookie)],
    set: (value: string) => {
        if (useCookie) {
            cookiesContext.set(appendCookiePrefix(cookie), value, { path: "/" })
        } else {
            memoryCookies[appendCookiePrefix(cookie)] = value
        }
    },
})

export const cookies = {
    accessToken: createSpecificCookieMethods("access-token"),
}
