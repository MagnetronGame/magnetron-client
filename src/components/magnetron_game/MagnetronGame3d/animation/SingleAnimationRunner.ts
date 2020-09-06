import { Anim, AnimRunner, SingleAnim } from "./animationTypes"

export class SingleAnimationRunner extends AnimRunner {
    private anim: SingleAnim
    private duration: number
    private currDuration: number
    isFinished: boolean = false

    constructor(parent: AnimRunner | null, anim: SingleAnim) {
        super(parent)
        this.anim = anim
        const duration = anim.duration || -1
        this.duration = duration
        this.currDuration = 0
    }

    public start = () => {
        console.log(`Starting anim: ${this.anim.name || "anonymous"}`)
        this.anim.start &&
            this.anim.start({
                duration: this.duration,
                currDuration: this.currDuration,
                durationRatio: 0,
                durationRatioInv: 1,
            })
    }

    public update = (deltaTime: number) => {
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
        this.anim.end &&
            this.anim.end({
                duration: this.duration,
                currDuration: this.currDuration,
                durationRatio: 0,
                durationRatioInv: 1,
            })
    }
}
