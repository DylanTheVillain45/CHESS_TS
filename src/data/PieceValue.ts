import { Type } from "../enums/pieceEnum";

export const PieceValue: Record<Type, number> = {
    [Type.Pawn]: 100,
    [Type.Knight]: 300,
    [Type.Bishop]: 320,
    [Type.Rook]: 500,
    [Type.Queen]: 900,
    [Type.King]: 0 
}