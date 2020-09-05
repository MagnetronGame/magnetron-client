import { AnimRunner, ParallelAnims } from "./animationTypes"
import { createAnimationRunner } from "./animationHelpers"

export class ParallelAnimationsRunner extends AnimRunner {
    private parallelAnimsRunner: AnimRunner[]
    isFinished: boolean = false

    constructor(parent: AnimRunner | null, anims: ParallelAnims) {
        super(parent)
        this.parallelAnimsRunner = anims.anims.map((anim) => this.createAnimRunner(anim))
    }

    public start = () => {
        this.parallelAnimsRunner.forEach((animRunner) => animRunner.start())
    }

    public update = (deltaTime: number) => {
        const unfinishedAnimRunners = this.parallelAnimsRunner.filter(
            (animRunner) => !animRunner.isFinished,
        )
        if (unfinishedAnimRunners.length === 0) {
            this.isFinished = true
        } else {
            unfinishedAnimRunners.forEach((animRunner) => {
                animRunner.update(deltaTime)
                if (animRunner.isFinished) {
                    animRunner.end()
                }
            })
        }
    }

    public end = () => {
        this.parallelAnimsRunner
            .filter((animRunner) => !animRunner.isFinished)
            .forEach((animRunner) => animRunner.end())
    }
}
