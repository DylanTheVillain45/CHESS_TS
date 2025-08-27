import { Tile } from "./tile";
import { Type } from "../enums/pieceEnum";
import { Color } from "../enums/colorEnum";
import { Piece } from "./piece";
import { Move } from "./move";

export class Board {
  board: Tile[][];

  constructor(boardEl: HTMLDivElement) {
    this.board = this.CreateBoard(boardEl);
  }

  GetMoves(color: Color): Move[] {
    const moves: Move[] = []

    return moves;
  }

  CreateBoard(boardEl: HTMLDivElement): Tile[][] {
    const board: Tile[][] = [];

    for (let i = 7; i >= 0; i--) {
      let row: Tile[] = [];
      for (let j = 0; j < 8; j++) {
        let tile = new Tile(i, j, boardEl);
        if (i == 0 || i == 1 || i == 6 || i == 7) {
          let color = i == 0 || i == 1 ? Color.White : Color.Black;
          let type = Type.Pawn;
          if (i == 0 || i == 7) {
            if (j == 0 || j == 7) type = Type.Rook;
            else if (j == 1 || j == 6) type = Type.Knight;
            else if (j == 2 || j == 5) type = Type.Bishop;
            else if (j == 3) type = Type.Queen;
            else if (j == 4) type = Type.King;
          }

          let piece = new Piece(tile, j, i, type, color);
          tile.AddPiece(piece);
        }
        row.push(tile);
      }
      board.push(row);
    }

    return board;
  }
}