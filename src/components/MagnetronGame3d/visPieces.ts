import {
    Avatar,
    CoinPiece,
    MagnetPiece,
    MagnetType,
    Piece,
    StaticPieces,
} from "../../services/magnetronServerService/magnetronGameTypes"
import * as THREE from "three"
import { StaticBoard } from "./board"
import { MagnetColor } from "../../magnetronGameStyle"

export type VisPiece = {
    type: string
    pieceData: Piece
    pieceObject: THREE.Object3D
}

export const createVisPiece = (piece: Piece, staticBoard: StaticBoard): VisPiece => {
    switch (piece.type) {
        case "Avatar":
            return createVisAvatarPiece(piece as Avatar, staticBoard)
        case "CoinPiece":
            return createCoinPiece(piece as CoinPiece, staticBoard)
        case "MagnetPiece":
            return createMagnetPiece(piece as MagnetPiece, staticBoard)
        case "EmptyPiece":
            return EmptyVisPiece
        default:
            return EmptyVisPiece
    }
}

export const createVisAvatarPiece = (avatarPiece: Avatar, staticBoard: StaticBoard): VisPiece => {
    const radius = Math.min(staticBoard.cellSize.x, staticBoard.cellSize.y) / 4
    const height = 0.2

    const geom = new THREE.CylinderGeometry(radius * 0.8, radius, height, 24, 1)
    geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, height / 2, 0))
    const material = new THREE.MeshPhongMaterial({
        color: MagnetColor[avatarPiece.magnetType],
        transparent: true,
        opacity: 0.7,
    })

    const mesh = new THREE.Mesh(geom, material)
    const visPiece: VisPiece = {
        type: avatarPiece.type,
        pieceData: avatarPiece,
        pieceObject: mesh,
    }
    return visPiece
}

export const createCoinPiece = (coinPiece: CoinPiece, staticBoard: StaticBoard): VisPiece => {
    const radius = (Math.min(staticBoard.cellSize.x, staticBoard.cellSize.y) / 2) * 0.8
    const depth = 0.02

    const geom = new THREE.CylinderGeometry(radius, radius, depth, 24, 1)
    geom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, depth / 2, 0))

    const material = new THREE.MeshPhongMaterial({
        color: "#C0C0C0",
        // specular: "#C0C0C0",
        shininess: 25,
    })

    const mesh = new THREE.Mesh(geom, material)
    const visPiece: VisPiece = {
        type: coinPiece.type,
        pieceData: coinPiece,
        pieceObject: mesh,
    }
    return visPiece
}

export const createMagnetPiece = (magnetPiece: MagnetPiece, staticBoard: StaticBoard): VisPiece => {
    const width = Math.min(staticBoard.cellSize.x, staticBoard.cellSize.y) * 0.8
    const height = width
    const depth = 0.02

    const baseGeom = new THREE.BoxGeometry(width, depth, height)
    baseGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, depth / 2, 0))
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: "#8ca6a8",
    })

    const baseMesh = new THREE.Mesh(baseGeom, baseMaterial)
    const group = new THREE.Group()
    group.add(baseMesh)

    const magnetColor = MagnetColor[magnetPiece.magnetType]

    if (
        magnetPiece.magnetType === MagnetType.POSITIVE ||
        magnetPiece.magnetType === MagnetType.NEGATIVE
    ) {
        const magnetSizeRatio = 0.8
        const magnetSymbolThicknessRatio = 0.15
        const magnetDepth = 0.007
        const magnetGeomHor = new THREE.BoxGeometry(
            width * magnetSizeRatio,
            magnetDepth + depth / 2,
            height * magnetSymbolThicknessRatio,
        )
        magnetGeomHor.applyMatrix4(
            new THREE.Matrix4().makeTranslation(0, depth / 2 + magnetDepth, 0),
        )
        const magnetMaterial = new THREE.MeshPhongMaterial({
            color: magnetColor,
            transparent: true,
            opacity: 0.7,
        })

        const magnetMeshHor = new THREE.Mesh(magnetGeomHor, magnetMaterial)
        group.add(magnetMeshHor)

        if (magnetPiece.magnetType === MagnetType.POSITIVE) {
            const magnetGeomVert = magnetGeomHor.clone().rotateY(Math.PI / 2)
            const magnetMeshVer = new THREE.Mesh(magnetGeomVert, magnetMaterial)
            group.add(magnetMeshVer)
        }
    }

    const visPiece: VisPiece = {
        type: magnetPiece.type,
        pieceData: magnetPiece,
        pieceObject: group,
    }

    return visPiece
}

const createEmptyVisPiece = (): VisPiece => {
    const visPiece: VisPiece = {
        type: "EmptyPiece",
        pieceData: StaticPieces.EMPTY,
        pieceObject: new THREE.Object3D(),
    }
    return visPiece
}

export const EmptyVisPiece: VisPiece = createEmptyVisPiece()
