import { SingleAnim } from "./animation/animationTypes"
import * as THREE from "three"
export default (scene: THREE.Scene, toColor: THREE.Color, duration: number = 0.5): SingleAnim => {
    const originalBackground = (scene.background as THREE.Color).clone()
    return {
        duration,
        update: ({ durationRatio }) => {
            scene.background = originalBackground.clone().lerp(toColor, durationRatio * 0.8)
        },
        end: () => (scene.background = toColor),
    }
}
