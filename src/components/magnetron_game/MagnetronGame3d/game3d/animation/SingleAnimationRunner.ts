import { SingleAnim } from "./animationTypes"
import { AnimRunner } from "./AnimRunner"

export class SingleAnimationRunner extends AnimRunner {
    private anim: SingleAnim
    private duration: number
    private currDuration: number

    constructor(anim: SingleAnim, parent?: AnimRunner) {
        super(parent, anim.name)
        this.anim = anim
        const duration = anim.duration || -1
        this.duration = duration
        this.currDuration = 0
    }

    public start = () => {
        super.start()
        this.anim.start &&
            this.anim.start({
                duration: this.duration,
                currDuration: this.currDuration,
                durationRatio: 0,
                durationRatioInv: 1,
            })
    }

    public update = (deltaTime: number) => {
        super.update(deltaTime)
        this.currDuration += deltaTime

        const durationRatio = this.currDuration / this.duration
        const durationRatioInv = 1 - durationRatio

        this.anim.update &&
            this.anim.update({
                duration: this.duration,
                currDuration: this.currDuration,
                deltaTime,
                durationRatio,
                durationRatioInv,
            })

        if (this.currDuration >= this.duration) {
            this.isFinished = true
        }
    }

    public end = () => {
        super.end()
        this.anim.end &&
            this.anim.end({
                duration: this.duration,
                currDuration: this.currDuration,
                durationRatio: 0,
                durationRatioInv: 1,
            })
    }
}
