import { Animation } from "./animation"
import { Magnetron } from "../magnetron"

export type InlineAnimationType = {
    duration?: number
    looping?: boolean
    start?: (props: { game: Magnetron; currDuration: number; duration: number }) => void
    update?: (props: {
        game: Magnetron
        deltaTime: number
        currDuration: number
        duration: number
    }) => void
    end?: (props: { game: Magnetron; currDuration: number; duration: number }) => void
}

export class InlineAnimation extends Animation {
    private inlineAnimation: InlineAnimationType

    constructor(inlineAnim: InlineAnimationType) {
        const duration = inlineAnim.duration || -1
        const looping = inlineAnim.looping || false
        super(duration, looping)
        this.inlineAnimation = inlineAnim
    }

    protected start(game: Magnetron): void {
        if (this.inlineAnimation.start) {
            this.inlineAnimation.start({
                game,
                currDuration: this.currDuration,
                duration: this.duration,
            })
        }
    }

    protected update(game: Magnetron, deltaTime: number): void {
        if (this.inlineAnimation.update) {
            this.inlineAnimation.update({
                game,
                deltaTime,
                currDuration: this.currDuration,
                duration: this.duration,
            })
        }
    }

    protected end(game: Magnetron): void {
        if (this.inlineAnimation.end) {
            this.inlineAnimation.end({
                game,
                currDuration: this.currDuration,
                duration: this.duration,
            })
        }
    }
}
