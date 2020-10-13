import * as THREE from "three"
import { range } from "../../../../../../utils/arrayUtils"
import { StaticBoard } from "../board"
import MagnetronTheme from "../../../MagnetronTheme"

export type VisBoardPlate = {
    object: THREE.Object3D
    cells: THREE.Mesh[][]
    edgesCol: THREE.Mesh[]
    edgesRow: THREE.Mesh[]
}

export default (staticBoard: StaticBoard): VisBoardPlate => {
    const cellGeom = new THREE.BoxGeometry(
        staticBoard.cellSize.x,
        staticBoard.thickness,
        staticBoard.cellSize.y,
    )
    const material = new THREE.MeshPhongMaterial({
        color: MagnetronTheme.board.baseColor,
        shininess: 3,
    })

    const cellsMesh = staticBoard.cellsCenterPosition.map((cellCol) =>
        cellCol.map((cellCenterPos) => {
            const mesh = new THREE.Mesh(cellGeom, material)
            mesh.position.x = cellCenterPos.x
            mesh.position.z = cellCenterPos.y
            return mesh
        }),
    )

    const edgeGeom = new THREE.BoxGeometry(
        staticBoard.size.x + staticBoard.edgeWidth,
        staticBoard.thickness + staticBoard.edgeThickness,
        staticBoard.edgeWidth,
    )
    const edgeMaterial = new THREE.MeshPhongMaterial({
        color: MagnetronTheme.board.edgeColor,
        opacity: 0,
        transparent: true,
        shininess: 15,
    })

    const boardUpperLeft = staticBoard.center
        .clone()
        .sub(staticBoard.size.clone().multiplyScalar(0.5))

    const rowsEdgeMesh = range(staticBoard.cellCount.y + 1).map((y) => {
        const mesh = new THREE.Mesh(edgeGeom, edgeMaterial)
        mesh.position.z = boardUpperLeft.y + y * staticBoard.cellSize.y
        mesh.position.x = staticBoard.center.x
        return mesh
    })

    const colEdgeGeom = new THREE.BoxGeometry(
        staticBoard.edgeWidth,
        staticBoard.thickness + staticBoard.edgeThickness,
        staticBoard.size.y + staticBoard.edgeWidth,
    )

    const colsEdgeMesh = range(staticBoard.cellCount.x + 1).map((x) => {
        const mesh = new THREE.Mesh(colEdgeGeom, edgeMaterial)
        mesh.position.x = boardUpperLeft.x + x * staticBoard.cellSize.x
        mesh.position.z = staticBoard.center.y
        return mesh
    })

    const object = new THREE.Object3D()
    cellsMesh.forEach((cellCol) => cellCol.forEach((cellMesh) => object.add(cellMesh)))
    rowsEdgeMesh.forEach((edge) => object.add(edge))
    colsEdgeMesh.forEach((edge) => object.add(edge))

    const boardObject: VisBoardPlate = {
        object,
        cells: cellsMesh,
        edgesCol: colsEdgeMesh,
        edgesRow: rowsEdgeMesh,
    }
    return boardObject
}

export const resetVisBoardPlateCellPositions = (
    staticBoard: StaticBoard,
    visBoardPlate: VisBoardPlate,
) => {
    range(staticBoard.cellCount.x).forEach((x) => {
        range(staticBoard.cellCount.y).forEach((y) => {
            const cellStaticPos = staticBoard.cellsCenterPosition[x][y]
            const cellMesh = visBoardPlate.cells[x][y]
            cellMesh.position.set(cellStaticPos.x, 0, cellStaticPos.y)
        })
    })
}
