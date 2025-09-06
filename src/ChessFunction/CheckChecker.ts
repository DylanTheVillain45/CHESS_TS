import { Piece } from "../Classes/piece";
import { Tile } from "../Classes/tile";
import { MoveMap } from "../data/MoveMap";
import { DebugHelp } from "../Debug/DebugHelp";
import { Color } from "../enums/colorEnum";
import { Type } from "../enums/pieceEnum";

export class CheckChecker {
  public static CheckCheck(board: Tile[][], kingPiece: Piece): boolean {
    let opponentColor: Color =
      kingPiece.color === Color.White ? Color.Black : Color.White;

    return (
      CheckChecker.IsPawnCheck(board, kingPiece, opponentColor) ||
      CheckChecker.IsPieceCheck(board, kingPiece, opponentColor)
    );
  }

  public static FindKing(board: Tile[][], color: Color): Piece {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j].piece
        if (piece && piece.type == Type.King && piece.color == color) {
          return piece;
        }
      }
    }
    DebugHelp.ConsoleBoard(board)
    throw new Error("Cant find king");

  }

  public static IsPieceCheck(
    board: Tile[][],
    kingPiece: Piece,
    opColor: Color
  ): boolean {
    const checkingPieces: Type[] = [
      Type.Knight,
      Type.Bishop,
      Type.Rook,
      Type.Queen,
      Type.King,
    ];

    for (const type of checkingPieces) {
      for (const [dx, dy, repeatable] of MoveMap[type]) {
        let x = kingPiece.x + dx;
        let y = kingPiece.y + dy;

        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const landingTile: Tile = board[y][x];
          if (landingTile.piece) {
            if (
              landingTile.piece.color === opColor &&
              landingTile.piece.type === type
            ) {
              return true;
            }
            break; // blocked by another piece
          }

          if (!repeatable) break;

          x += dx;
          y += dy;
        }
      }
    }

    return false;
  }

  public static IsPawnCheck(
    board: Tile[][],
    kingPiece: Piece,
    opColor: Color
  ): boolean {
    let dir = opColor === Color.White ? -1 : 1;

    for (let dx of [-1, 1]) {
      let newX = kingPiece.x + dx;
      let newY = kingPiece.y + dir;

      if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
        const landingTile: Tile = board[newY][newX];
        const landingPiece = landingTile.piece;

        if (
          landingPiece &&
          landingPiece.type === Type.Pawn &&
          landingPiece.color === opColor
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

