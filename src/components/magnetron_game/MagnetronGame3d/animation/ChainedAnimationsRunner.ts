import { SingleAnimationRunner } from "./SingleAnimationRunner"
import { AnimRunner, Anim, ChainedAnims } from "./animationTypes"
import { createAnimationRunner } from "./animationHelpers"

export class ChainedAnimationsRunner extends AnimRunner {
    private readonly animRunners: AnimRunner[] = []
    private started: boolean = false

    constructor(parent: AnimRunner | null, anims: ChainedAnims) {
        super(parent)
        this.animRunners = anims.map((anim) => this.createAnimRunner(anim))
    }

    public addAnim(anim: Anim) {
        this.animRunners.push(this.createAnimRunner(anim))
        if (this.animRunners.length === 1 && this.started) {
            this.animRunners[0].start()
        }
    }

    public start = () => {
        this.animRunners[0]?.start()
        this.started = true
    }

    public update = (deltaTime: number) => {
        while (true) {
            if (this.animRunners.length > 0) {
                const currAnimRunner = this.animRunners[0]
                currAnimRunner.update(deltaTime)

                if (currAnimRunner.isFinished) {
                    currAnimRunner.end()
                    this.animRunners.shift()
                    this.animRunners[0]?.start()
                } else {
                    break
                }
            } else {
                this.isFinished = true
                break
            }
        }
    }

    public end = () => {
        this.animRunners.forEach((anims) => anims.end())
    }
}
