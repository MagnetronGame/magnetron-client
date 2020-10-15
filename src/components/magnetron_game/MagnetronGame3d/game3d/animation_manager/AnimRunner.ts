export abstract class AnimRunner {
    animName?: string = undefined
    isFinished: boolean = false
    parent: AnimRunner | null = null
    logging?: boolean = undefined // undefined means inherit

    constructor(parent?: AnimRunner, animName?: string, logging?: boolean) {
        this.parent = parent || null
        this.animName = animName
        this.logging = logging
    }

    public get shouldLog(): boolean {
        return this.logging === undefined
            ? this.parent
                ? this.parent.shouldLog
                : false
            : this.logging
    }

    public start() {
        if (this.shouldLog) {
            console.log("  ".repeat(this.getAncestorCount()), "Anim", this.animName, "=>")
        }
    }
    public update(deltaTime: number) {}
    public end() {
        if (this.shouldLog) {
            console.log("  ".repeat(this.getAncestorCount()), "<=")
        }
    }

    private getAncestorCount = (): number => (this.parent ? this.parent.getAncestorCount() + 1 : 0)
}

export abstract class MutableAnimRunner extends AnimRunner {
    abstract add(animRunner: AnimRunner): void
}
