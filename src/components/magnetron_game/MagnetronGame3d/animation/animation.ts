import { Magnetron } from "../magnetron"
import { Entity } from "../Entity"

export abstract class Animation extends Entity {
    public readonly duration: number
    public readonly looping: boolean

    private animationAfter: Animation | null = null
    private animationWith: Animation | null = null

    public currDuration: number = 0

    protected constructor(duration: number, looping: boolean = false) {
        super()
        this.duration = duration
        this.looping = looping
    }

    public internalUpdate(game: Magnetron, deltaTime: number) {
        if (this.currDuration >= this.duration && !this.looping) {
            super.remove()
        }

        super.internalUpdate(game, deltaTime)

        this.currDuration += deltaTime
    }

    public internalStart(game: Magnetron) {
        super.internalStart(game)
        if (this.animationWith) {
            game.addEntity(this.animationWith)
        }
    }

    public internalEnd(game: Magnetron) {
        super.internalEnd(game)
        console.log("Anim end", this)
        if (this.animationAfter) {
            game.addEntity(this.animationAfter)
        }
    }

    public playWith(animation: Animation): Animation {
        this.animationWith = animation
        return this
    }

    public thenPlay(animation: Animation): Animation {
        this.animationAfter = animation
        return this
    }
}
