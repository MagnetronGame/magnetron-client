export type CustomHashMapItem<K, V> = {
    key: K
    value: V
}

export class CustomHashMap<K, V, H = string> {
    backingMap: Map<H, CustomHashMapItem<K, V>>
    hashFunc: (item: K) => H

    constructor(hashFunc: (item: K) => H, initialValues: [K, V][] = []) {
        this.backingMap = new Map()
        this.hashFunc = hashFunc
    }

    set = (key: K, value: V): this => {
        const kHash = this.hashFunc(key)
        this.backingMap.set(kHash, { value, key })
        return this
    }

    get = (key: K): V | undefined => {
        const kHash = this.hashFunc(key)
        return this.backingMap.get(kHash)?.value
    }

    has = (k: K): boolean => {
        const kHash = this.hashFunc(k)
        return this.backingMap.has(kHash)
    }

    setIfAbsent = (key: K, value: V): V => {
        if (this.has(key)) {
            return this.get(key)!
        } else {
            this.set(key, value)
            return value
        }
    }

    keys = (): K[] => [...this.backingMap.values()].map((k) => k.key)
    values = (): V[] => [...this.backingMap.values()].map((k) => k.value)
    entries = (): CustomHashMapItem<K, V>[] => [...this.backingMap.values()]
}
