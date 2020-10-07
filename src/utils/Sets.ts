export const Sets = {
    union: <T>(a: Set<T>, b: Set<T>): Set<T> => new Set([...a, ...b]),
    intersection: <T>(a: Set<T>, b: Set<T>): Set<T> => new Set([...a].filter((x) => b.has(x))),
    diff: <T>(orig: Set<T>, sub: Set<T>): Set<T> => new Set([...orig].filter((x) => !sub.has(x))),
}
