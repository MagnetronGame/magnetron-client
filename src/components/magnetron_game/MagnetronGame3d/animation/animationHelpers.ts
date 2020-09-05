import { SingleAnimationRunner } from "./SingleAnimationRunner"
import { ChainedAnimationsRunner } from "./ChainedAnimationsRunner"
import {
    Anim,
    AnimRunner,
    ChainedAnims,
    LoopingAnim,
    ParallelAnims,
    SingleAnim,
} from "./animationTypes"
import { ParallelAnimationsRunner } from "./ParallelAnimationsRunner"

export const Anims = {
    parallel: (anims: Anim[]): ParallelAnims => ({
        parallel: true,
        anims,
    }),
    chained: (anims: Anim[]): ChainedAnims => anims,
    looping: (anim: Anim): Anim => ({ looping: true, anim: anim }),
}

const animIsSingleAnim = (anim: Anim): anim is SingleAnim =>
    (anim as SingleAnim).duration !== undefined

const animIsParallelAnims = (anim: Anim): anim is ParallelAnims =>
    (anim as ParallelAnims).parallel !== undefined

const animIsChainedAnims = (anim: Anim): anim is ChainedAnims => Array.isArray(anim)

const animIsLoopingAnim = (anim: Anim): anim is LoopingAnim => (anim as LoopingAnim).looping

export const createAnimationRunner = (
    parent: AnimRunner | null,
    anim: Anim,
): { animRunner: AnimRunner; looping: boolean } => {
    if (animIsSingleAnim(anim)) {
        return { animRunner: new SingleAnimationRunner(parent, anim), looping: false }
    } else if (animIsParallelAnims(anim)) {
        return { animRunner: new ParallelAnimationsRunner(parent, anim), looping: false }
    } else if (animIsChainedAnims(anim)) {
        return { animRunner: new ChainedAnimationsRunner(parent, anim), looping: false }
    } else if (animIsLoopingAnim(anim)) {
        return {
            animRunner: createAnimationRunner(parent, anim.anim).animRunner,
            looping: true,
        }
    } else throw new Error("invalid anim type")
}
