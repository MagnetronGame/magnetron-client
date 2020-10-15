import { Vec2I } from "../../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import * as vec2i from "../../../../../utils/vec2IUtils"

export default class DomHandler {
    private rootNode: HTMLElement
    private prevRootNodeSize: Vec2I

    constructor(rootNode: HTMLElement) {
        this.rootNode = rootNode
        this.prevRootNodeSize = this.getRootSize()
    }

    public appendChild(node: HTMLElement) {
        this.rootNode.appendChild(node)
    }

    public getRootWidth(): number {
        return this.rootNode.clientWidth
    }

    public getRootHeight(): number {
        return this.rootNode.clientHeight
    }

    public getRootSize(): Vec2I {
        return { x: this.getRootWidth(), y: this.getRootHeight() }
    }

    public checkRootResized(handler: (size: Vec2I, prevSize: Vec2I) => void): boolean {
        const newSize = this.getRootSize()
        const prevSize = this.prevRootNodeSize
        const needResize = !vec2i.equals(newSize, prevSize)
        if (needResize) {
            this.prevRootNodeSize = newSize
            handler(newSize, prevSize)
        }
        return needResize
    }
}
