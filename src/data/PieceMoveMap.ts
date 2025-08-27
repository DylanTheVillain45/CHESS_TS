import { Type } from "../enums/pieceEnum";

export const MoveMap: Partial<Record<Type, [number, number, boolean][]>> = {
  [Type.Knight]: [
    [1, 2, false],
    [2, 1, false],
    [-1, 2, false],
    [-2, 1, false],
    [1, -2, false],
    [2, -1, false],
    [-1, -2, false],
    [-2, -1, false],
  ],

  [Type.Bishop]: [
    [1, 1, true],
    [1, -1, true],
    [-1, 1, true],
    [-1, -1, true],
  ],

  [Type.Rook]: [
    [1, 0, true],
    [-1, 0, true],
    [0, 1, true],
    [0, -1, true],
  ],

  [Type.Queen]: [
    // Rook moves
    [1, 0, true],
    [-1, 0, true],
    [0, 1, true],
    [0, -1, true],
    // Bishop moves
    [1, 1, true],
    [1, -1, true],
    [-1, 1, true],
    [-1, -1, true],
  ],

  [Type.King]: [
    [1, 0, false],
    [-1, 0, false],
    [0, 1, false],
    [0, -1, false],
    [1, 1, false],
    [1, -1, false],
    [-1, 1, false],
    [-1, -1, false],
  ],
};
