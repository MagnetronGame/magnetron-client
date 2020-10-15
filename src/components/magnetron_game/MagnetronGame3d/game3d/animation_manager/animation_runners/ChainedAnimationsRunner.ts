import { AnimRunner, MutableAnimRunner } from "../AnimRunner"

export class ChainedAnimationsRunner extends MutableAnimRunner {
    private readonly animRunners: AnimRunner[] = []
    private started: boolean = false

    constructor(animRunners: AnimRunner[], name?: string, parent?: AnimRunner) {
        super(parent, name)
        animRunners.forEach((ar) => (ar.parent = this))
        this.animRunners = animRunners
    }

    public add(animRunner: AnimRunner) {
        animRunner.parent = this
        this.animRunners.push(animRunner)
        if (this.animRunners.length === 1 && this.started) {
            this.animRunners[0].start()
        }
    }

    public start = () => {
        super.start()
        this.animRunners[0]?.start()
        this.started = true
    }

    public update = (deltaTime: number) => {
        super.update(deltaTime)
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
        super.end()
        this.animRunners.forEach((anims) => anims.end())
    }
}
