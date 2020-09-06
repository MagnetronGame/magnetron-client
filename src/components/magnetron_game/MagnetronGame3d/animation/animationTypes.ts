import { createAnimationRunner } from "./animationHelpers"

export type AnimStdProps = {
    currDuration: number
    duration: number
    durationRatio: number
    durationRatioInv: number
}

export type AnimUpdateProps = AnimStdProps & {
    deltaTime: number
}

export type SingleAnim = {
    name?: string
    duration?: number
    start?: (props: AnimStdProps) => void
    update?: (props: AnimUpdateProps) => void
    end?: (props: AnimStdProps) => void
}

export type ParallelAnims = {
    parallel: boolean
    anims: Anim[]
}

export type ChainedAnims = Anim[]

export type LoopingAnim = {
    looping: boolean
    anim: Anim
}

export type Anim = SingleAnim | ChainedAnims | ParallelAnims | LoopingAnim

export abstract class AnimRunner {
    public isFinished: boolean = false
    public isLooping: boolean = false
    public parent: AnimRunner | null

    constructor(parent: AnimRunner | null) {
        this.parent = parent
    }

    abstract start: () => void
    abstract update: (deltaTime: number) => void
    abstract end: () => void

    protected createAnimRunner(anim: Anim): AnimRunner {
        const { animRunner, looping } = createAnimationRunner(this, anim)
        if (looping) {
            const loopingAnim: Anim = {
                duration: 0,
                start: () => this.postLooping(loopingAnim),
            }
            return createAnimationRunner(this, loopingAnim).animRunner
        } else {
            return animRunner
        }
    }

    protected postLooping(anim: Anim) {
        if (this.parent) {
            this.parent.postLooping(anim)
        }
    }
}
