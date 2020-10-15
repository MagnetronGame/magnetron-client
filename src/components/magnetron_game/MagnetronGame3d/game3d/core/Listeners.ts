import { Magnetron3d } from "../Magnetron3d"
import World from "../world/World"
import { AvatarsDisplayPositionChangeListener } from "../world/WorldListeners"

export default class Listeners {
    private game: Magnetron3d
    private world: World

    private readonly gameEndCallbacks: ((game: Magnetron3d) => void)[] = []

    constructor(game: Magnetron3d, world: World) {
        this.game = game
        this.world = world
    }

    public onAvatarDisplayPositionChange(listener: AvatarsDisplayPositionChangeListener) {
        this.world.listeners.onAvatarDisplayPositionChange(listener)
    }

    public onGameEnd(): Promise<Magnetron3d> {
        return new Promise((resolve) => {
            this.gameEndCallbacks.push((g) => resolve(g))
        })
    }

    public __start() {}
    public __update() {}
    public __end() {
        this.gameEndCallbacks.forEach((call) => call(this.game))
    }
}
