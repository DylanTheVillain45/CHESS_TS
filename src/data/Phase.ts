import { Type } from "../enums/pieceEnum"

export const PhaseValues: Record<Type, number> = {
    [Type.Pawn]: 0,
    [Type.Knight]: 1,
    [Type.Bishop]: 1,
    [Type.Rook]: 2,
    [Type.Queen]: 4,
    [Type.King]: 0
} 