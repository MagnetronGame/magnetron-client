import React, { useEffect, useRef } from "react"
import { Magnetron } from "./magnetron"
import { MagAction, MagState } from "../../services/magnetronServerService/magnetronGameTypes"

type Props = {
    className?: string
    style?: React.CSSProperties
    magState: MagState
    possibleMagActions: MagAction[]
    onMagAction: (action: MagAction) => void
}

const MagnetronGame3d: React.FC<Props> = ({
    className,
    style,
    magState: state,
    possibleMagActions,
}) => {
    const rootNode = useRef<HTMLDivElement>(null)
    const magnetron = useRef<Magnetron>(null)

    useEffect(() => {
        if (rootNode.current && state) {
            // @ts-ignore
            magnetron.current = new Magnetron(rootNode.current)
            magnetron.current.startAndLoop(state)
        }
    }, [rootNode, state])

    return <div ref={rootNode} style={{ width: "100%", height: "100%" }}></div>
}

export default MagnetronGame3d
