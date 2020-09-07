import React, { useEffect, useRef, useState } from "react"
import { Magnetron } from "./magnetron"
import { MagAction, MagState } from "../../../services/magnetronServerService/magnetronGameTypes"

type Props = {
    className?: string
    style?: React.CSSProperties
    magState: MagState
    possibleMagActions?: MagAction[]
    onMagAction?: (action: MagAction) => void
}

const MagnetronGame3d: React.FC<Props> = ({
    className,
    style,
    magState: state,
    possibleMagActions,
}) => {
    const rootNode = useRef<HTMLDivElement>(null)
    const magnetron = useRef<Magnetron>(null)
    const [initialState, setInitialState] = useState<boolean>(true)

    useEffect(() => {
        if (rootNode.current) {
            // @ts-ignore
            magnetron.current = new Magnetron(rootNode.current)
        }
    }, [rootNode])

    useEffect(() => {
        if (magnetron.current && state) {
            if (initialState) {
                magnetron.current.startAndLoop(state)
                setInitialState(false)
            } else {
                magnetron.current.updateState(state)
            }
        }
    }, [magnetron, state])

    return <div ref={rootNode} style={{ width: "100%", height: "100%" }}></div>
}

export default MagnetronGame3d
