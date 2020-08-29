import { Magnetron } from "./magnetron"

export abstract class Entity {
    public shouldRemove = false

    protected abstract start(game: Magnetron): void
    protected abstract update(game: Magnetron, deltaTime: number): void
    protected abstract end(game: Magnetron): void

    public internalStart(game: Magnetron) {
        this.start(game)
    }

    public internalUpdate(game: Magnetron, deltaTime: number) {
        this.update(game, deltaTime)
    }

    public internalEnd(game: Magnetron) {
        this.end(game)
    }

    public remove() {
        this.shouldRemove = true
    }
}
