import { Anim, AnimStdProps, ChainedAnims, ParallelAnims, SingleAnim } from "./animationTypes"

export const Anims = {
    parallel: (anims: Anim[], name?: string, context?: string): ParallelAnims => ({
        parallel: true,
        name,
        context,
        anims,
    }),
    chained: (anims: Anim[], name?: string, context?: string): ChainedAnims => ({
        chained: true,
        name,
        context,
        anims,
    }),
    run: (cmd: (props: AnimStdProps) => void) => ({
        duration: 0,
        start: cmd,
    }),
}

export const Duration = {
    INF: Number.MAX_VALUE,
    NONE: 0,
}

export const animIsSingleAnim = (anim: Anim): anim is SingleAnim =>
    (anim as SingleAnim).duration !== undefined

export const animIsParallelAnims = (anim: Anim): anim is ParallelAnims =>
    (anim as ParallelAnims).parallel

export const animIsChainedAnims = (anim: Anim): anim is ChainedAnims =>
    (anim as ChainedAnims).chained
