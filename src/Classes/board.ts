import { Tile } from "./tile";
import { Type } from "../enums/pieceEnum";
import { Color } from "../enums/colorEnum";
import { Piece } from "./piece";
import { Move } from "./move";
import { MoveHelper } from "../ChessFunction/MoveHelper";
import { DebugHelp } from "../Debug/DebugHelp";

export class Board {
  board: Tile[][];

  constructor(boardEl: HTMLDivElement, private HandleClick: (tile: Tile) => void) {
    this.board = this.CreateBoard(boardEl);
    this.HandleClick = HandleClick;
  }

  CreateBoard(boardEl: HTMLDivElement): Tile[][] {
    const board: Tile[][] = [];

    for (let i = 7; i >= 0; i--) {
      let row: Tile[] = [];
      for (let j = 0; j < 8; j++) {
        let tile = new Tile(i, j, boardEl, this.HandleClick);
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

          let piece = new Piece(tile, i, j, type, color);
          tile.AddPiece(piece);
        }
        row.push(tile);
      }
      board[i] = row;
    }

    return board;
  }

  GetMoves(color: Color): Move[] {
    let moves: Move[] = [];

    this.board.forEach((row: Tile[], rowIndex: number) => {
      row.forEach((tile: Tile, colIndex: number) => {
        if (tile.piece != null && tile.piece.color == color) {
          const pieceMoves: Move[] = this.GetPieceMoves(tile.piece);

          moves = [...moves, ...pieceMoves]          
        }
      })
    })

    return moves;
  }

  GetPieceMoves(piece: Piece): Move[] {
    let moves: Move[];

    if (piece.type == Type.Pawn) {
      moves = MoveHelper.GetPawnMoves(this, piece);
    } else {
      moves = MoveHelper.GetNonPawnMoves(this, piece);
    }


    return moves;

  }
}