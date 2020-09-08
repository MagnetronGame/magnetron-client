export const parseQueryParams = (url: string): Record<string, string> => {
    const search = url.substring(url.lastIndexOf("?") + 1)
    const parts = search.split("&")
    const searchObject = Object.fromEntries(parts.map((part) => part.split("=")))
    return searchObject
}

export const stringifyQueryParams = (...paramsObjects: { [k: string]: any }[]) => {
    const mergedParams = Object.assign({}, ...paramsObjects)
    return (
        "?" +
        Object.entries(mergedParams)
            .map(([key, val]) => key + "=" + val)
            .join("&")
    )
}
