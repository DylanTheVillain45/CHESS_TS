import type { Tile } from "./tile";

export class Piece {
    tile: Tile;
    
    x: number;
    y: number

    constructor(tile: Tile, x: number, y: number) {
        this.tile = tile;
        this.x = x;
        this.y = y;
    }
}