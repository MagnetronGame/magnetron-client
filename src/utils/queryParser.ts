export const parseQueryParams = (url: string): Record<string, string> => {
    const search = url.substring(url.lastIndexOf("?") + 1)
    const parts = search.split("&")
    const searchObject = Object.fromEntries(parts.map((part) => part.split("=")))
    return searchObject
}
