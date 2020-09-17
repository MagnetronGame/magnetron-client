export const range = (length: number, start: number = 0) =>
    Array.from(Array(length).keys()).map((i) => i + start)

export const repeat = <T>(times: number, elem: T) => range(times).map(() => elem)

export const replace = <T>(arr: T[], index: number, elem: T) => [
    ...arr.slice(0, index),
    elem,
    ...arr.slice(index + 1),
]

export const addOrReplace = <T>(arr: T[], index: number, elem: T): (T | null)[] => {
    if (index >= arr.length) {
        return [...arr, ...repeat(index - arr.length, null), elem]
    } else return replace(arr, index, elem)
}
