import { Entity } from "../Entity"
import { Magnetron } from "../magnetron"
import { ChainedAnimationsRunner } from "./ChainedAnimationsRunner"
import { Anim } from "./animationTypes"
import { ParallelAnimationsRunner } from "./ParallelAnimationsRunner"
import { SingleAnimationRunner } from "./SingleAnimationRunner"
import { animIsChainedAnims, animIsParallelAnims, animIsSingleAnim } from "./animationHelpers"
import { AnimRunner, MutableAnimRunner } from "./AnimRunner"

export default class AnimationManager extends AnimRunner {
    readonly isFinished = false
    readonly parent = null
    readonly entity: Entity = new AnimationManagerEntity(this)

    private readonly animationContexts: { [k: string]: MutableAnimRunner }

    constructor() {
        super()
        this.animationContexts = {
            "main-queue": new ChainedAnimationsRunner([], "main-queue", this),
            "main-parallel": new ParallelAnimationsRunner([], "main-parallel", this),
        }
    }

    public add(anim: Anim) {
        const baseContext = anim.context || "main-queue"
        const animRunner = this.createAnimationRunner(baseContext, anim)
        this.addAnimationRunnerToContext(animRunner, baseContext)
    }

    start = () => {
        super.start()
        Object.values(this.animationContexts).forEach((ar) => ar.start())
    }
    update = (deltaTime: number) => {
        super.update(deltaTime)
        Object.values(this.animationContexts).forEach((ar) => ar.update(deltaTime))
    }
    end = () => {
        super.end()
        Object.values(this.animationContexts).forEach((ar) => ar.end())
    }

    private addAnimationRunnerToContext(animRunner: AnimRunner, context: string) {
        const animContext = this.animationContexts[context]
        if (animContext) {
            animContext.add(animRunner)
        } else throw new Error("Trying to add an animation to a non-existing context: " + context)
    }

    private createAnimationRunner = (baseContext: string, anim: Anim): AnimRunner => {
        const context = anim.context || baseContext

        if (context === baseContext) {
            if (animIsSingleAnim(anim)) {
                return new SingleAnimationRunner(anim)
            } else if (animIsParallelAnims(anim)) {
                return new ParallelAnimationsRunner(
                    anim.anims.map((a) => this.createAnimationRunner(baseContext, a)),
                    anim.name,
                )
            } else if (animIsChainedAnims(anim)) {
                return new ChainedAnimationsRunner(
                    anim.anims.map((a) => this.createAnimationRunner(baseContext, a)),
                    anim.name,
                )
            } else throw new Error("invalid anim type")
        } else {
            const animRunner = this.createAnimationRunner(context, anim)
            const contextSwitchAnim = {
                name: `Context switch ${baseContext} -> ${context}`,
                duration: 0,
                start: () => this.addAnimationRunnerToContext(animRunner, context),
            }
            return this.createAnimationRunner(baseContext, contextSwitchAnim)
        }
    }
}

class AnimationManagerEntity extends Entity {
    animationManager: AnimationManager

    constructor(animationManager: AnimationManager) {
        super()
        this.animationManager = animationManager
    }

    protected start(game: Magnetron): void {
        this.animationManager.start()
    }

    protected update(game: Magnetron, deltaTime: number): void {
        this.animationManager.update(deltaTime)
        this.shouldRemove = this.animationManager.isFinished
    }

    protected end(game: Magnetron): void {
        this.animationManager.end()
    }
}
