import { Entity } from "../Entity"
import { Magnetron } from "../magnetron"
import { ChainedAnimationsRunner } from "./ChainedAnimationsRunner"
import { Anim, AnimRunner } from "./animationTypes"
import { ParallelAnimationsRunner } from "./ParallelAnimationsRunner"

class AnimationQueueRunner extends AnimRunner {
    private queue: ChainedAnimationsRunner
    private loopRunner: ParallelAnimationsRunner

    constructor() {
        super(null)

        this.queue = new ChainedAnimationsRunner(this, [])
        this.loopRunner = new ParallelAnimationsRunner(this, { parallel: true, anims: [] })
    }

    public add(anim: Anim) {
        this.queue.addAnim(anim)
    }

    protected postLooping(anim: Anim) {
        // this.loopRunner.add(anim)
    }

    end = () => {
        this.queue.end()
        this.loopRunner.end()
    }
    start = () => {
        this.queue.start()
        this.loopRunner.start()
    }
    update = (deltaTime: number) => {
        this.queue.update(deltaTime)
        this.loopRunner.update(deltaTime)
    }
}

export class AnimationQueue extends Entity {
    private queue = new AnimationQueueRunner()

    public add(anim: Anim) {
        this.queue.add(anim)
    }

    protected start(game: Magnetron): void {
        this.queue.start()
    }

    protected update(game: Magnetron, deltaTime: number): void {
        this.queue.update(deltaTime)
    }

    protected end(game: Magnetron): void {
        this.queue.end()
    }
}
