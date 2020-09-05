import deepEqual from "deep-equal"

export const deepEquals = (v1: any, v2: any) => deepEqual(v1, v2, { strict: true })
