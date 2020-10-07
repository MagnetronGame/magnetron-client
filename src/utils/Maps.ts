export const Maps = {
    union: <V, K>(a: Map<K, V>, b: Map<K, V>): Map<K, V> => new Map([...a, ...b]),
    intersection: <V, K>(a: Map<K, V>, b: Map<K, V>): Map<K, V> =>
        new Map([...a].filter(([k, _]) => b.has(k))),
    diff: <K, V>(orig: Map<K, V>, sub: Map<K, V>): Map<K, V> =>
        new Map([...orig].filter(([k, _]) => !sub.has(k))),
}
