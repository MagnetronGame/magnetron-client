import { Animation } from "./animation"
import { Magnetron } from "./magnetron"

export class ChainedAnimations extends Animation {
    private readonly animations: Animation[]
    private currAnimationIndex: number = 0

    constructor(animations: Animation[], looping: boolean = false) {
        super(
            animations.map((anim) => anim.duration).reduce((acc, dur) => acc + Math.max(dur, 0), 0),
            looping,
        )

        this.animations = animations
    }

    start(game: Magnetron): void {
        this.animations[this.currAnimationIndex].internalStart(game)
    }

    update(game: Magnetron, deltaTime: number): void {
        const currAnimation = this.animations[this.currAnimationIndex]
        currAnimation.internalUpdate(game, deltaTime)
        if (currAnimation.shouldRemove) {
            currAnimation.internalEnd(game)

            if (this.currAnimationIndex >= this.animations.length - 1) {
                super.remove()
            } else {
                this.currAnimationIndex++
                this.animations[this.currAnimationIndex].internalStart(game)
            }
        }
    }

    end(game: Magnetron): void {}
}
