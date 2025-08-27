import { Color } from "../enums/colorEnum";
import { Type } from "../enums/pieceEnum";
import { Move } from "./move";
import type { Tile } from "./tile";

export class Piece {
    tile: Tile;
    x: number;
    y: number
    type: Type;
    color: Color;


    constructor(tile: Tile, x: number, y: number, type: Type, color: Color) {
        this.tile = tile;
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
    }

    GetAvailableMoves(board: Tile[][]): Move[] {
        const move: Move[] = []

        return move;
    }
}