import { Animation } from "./animation"
import { Magnetron } from "./magnetron"

export class ParallelAnimations extends Animation {
    private animations: Animation[]

    constructor(animations: Animation[]) {
        super(Math.max(...animations.map((anim) => anim.duration)))
        this.animations = animations
    }

    protected start(game: Magnetron): void {
        this.animations.forEach((anim) => game.addEntity(anim))
    }

    protected update(game: Magnetron, deltaTime: number): void {}

    protected end(game: Magnetron): void {}
}
