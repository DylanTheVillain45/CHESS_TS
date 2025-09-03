import { Color } from "../enums/colorEnum";
import { Type } from "../enums/pieceEnum";
import { Move } from "./move";
import type { Tile } from "./tile";

export class Piece {
  tile: Tile;
  x: number;
  y: number;
  type: Type;
  color: Color;

  constructor(tile: Tile, y: number, x: number, type: Type, color: Color) {
    this.tile = tile;
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
  }

  Move(tile: Tile, y: number, x: number) {
    this.tile = tile;
    this.y = y;
    this.x = x;
  }

  Promote(type: Type) {
    if (this.type == Type.Pawn) {
      this.type = type;
      this.tile.AddPiece(this)
    }
  }
}