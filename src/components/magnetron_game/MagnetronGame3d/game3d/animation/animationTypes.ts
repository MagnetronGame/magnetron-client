export type AnimStdProps = {
    currDuration: number
    duration: number
    durationRatio: number
    durationRatioInv: number
}

export type AnimUpdateProps = AnimStdProps & {
    deltaTime: number
}

export type AnimCommon = {
    name?: string
    context?: string // default "main-queue". Use "main-parallel" to run animation without halting the queue
}

export type SingleAnim = AnimCommon & {
    duration: number
    start?: (props: AnimStdProps) => void
    update?: (props: AnimUpdateProps) => void
    end?: (props: AnimStdProps) => void
}

export type ParallelAnims = AnimCommon & {
    parallel: boolean
    anims: Anim[]
}

export type ChainedAnims = AnimCommon & { chained: true; anims: Anim[] }

export type Anim = SingleAnim | ChainedAnims | ParallelAnims

// export type AnimRunner = {
//     animName?: string
//     isFinished: boolean
//     parent: AnimRunner | null
//
//     start: () => void
//     update: (deltaTime: number) => void
//     end: () => void
// }

// export type MutableAnimRunner = AnimRunner & {
//     add: (animRunner: AnimRunner) => void
// }
