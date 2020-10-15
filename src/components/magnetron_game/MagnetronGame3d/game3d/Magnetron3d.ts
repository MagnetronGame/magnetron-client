import AnimationManager from "./animation_manager/AnimationManager"
import { MagState } from "../../../../services/magnetronServerService/types/gameTypes/stateTypes"
import World from "./world/World"
import constructWorldAnim from "./world/constructWorldAnim"
import { updateWorldWithState } from "./world_update/worldUpdate"
import DeltaTime from "./utils/DeltaTime"
import DomHandler from "./core/DomHandler"
import { Anims } from "./animation_manager/animationHelpers"
import Listeners from "./core/Listeners"

export class Magnetron3d {
    private readonly world: World
    private readonly deltaTime: DeltaTime
    private readonly domHandler: DomHandler
    private readonly animManager: AnimationManager

    private shouldEnd = false
    private prevGameState: MagState | null = null

    public readonly listeners: Listeners

    constructor(rootElem: HTMLElement, initialState: MagState) {
        this.domHandler = new DomHandler(rootElem)
        this.deltaTime = new DeltaTime()
        this.world = new World(
            initialState.staticState,
            this.domHandler.getRootWidth(),
            this.domHandler.getRootHeight(),
        )
        this.domHandler.appendChild(this.world.getDomNode())
        this.animManager = new AnimationManager()
        this.listeners = new Listeners(this, this.world)

        this.onStart(initialState)
        requestAnimationFrame(this.loop)
    }

    public end() {
        const animGameEnd = Anims.run(() => this.shouldEnd)
        this.animManager.add(animGameEnd)
    }

    public endNow() {
        this.shouldEnd = true
    }

    public updateState(state: MagState) {
        const stateUpdateAnim = updateWorldWithState(state, this.prevGameState, this.world)
        this.animManager.add(stateUpdateAnim)

        if (state.lifecycleState.isTerminal) {
            this.end()
        }

        this.prevGameState = state
    }

    private onStart(initialState: MagState) {
        this.animManager.logging = false
        this.animManager.start()

        this.animManager.add(constructWorldAnim(this.world))

        this.updateState(initialState)

        this.listeners.__start()
    }

    private loop = () => {
        if (!this.shouldEnd) {
            requestAnimationFrame(this.loop)
            this.onUpdate()
        } else {
            this.onEnd()
        }
    }

    private onUpdate() {
        const deltaTimeSecs = this.deltaTime.deltaTimeSecs()
        this.animManager.update(deltaTimeSecs)

        this.domHandler.checkRootResized((newSize, prevSize) => {
            this.world.resizeView(newSize, prevSize)
        })
        this.world.render()
        this.listeners.__update()
    }

    private onEnd() {
        this.animManager.end()
        this.listeners.__end()
    }
}
