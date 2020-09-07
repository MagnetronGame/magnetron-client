import { AnimRunner, MutableAnimRunner } from "./AnimRunner"

export class ParallelAnimationsRunner extends MutableAnimRunner {
    private animRunners: AnimRunner[]
    started: boolean = false

    constructor(animRunners: AnimRunner[], name?: string, parent?: AnimRunner) {
        super(parent, name)
        animRunners.forEach((ar) => (ar.parent = this))
        this.animRunners = animRunners
    }

    public add(animRunner: AnimRunner) {
        animRunner.parent = this
        this.animRunners.push(animRunner)
        if (this.started) {
            animRunner.start()
        }
    }

    public start = () => {
        super.start()
        this.animRunners.forEach((animRunner) => animRunner.start())
        this.started = true
    }

    public update = (deltaTime: number) => {
        super.update(deltaTime)
        const unfinishedAnimRunners = this.animRunners.filter(
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
        super.end()
        this.animRunners
            .filter((animRunner) => !animRunner.isFinished)
            .forEach((animRunner) => animRunner.end())
    }
}
