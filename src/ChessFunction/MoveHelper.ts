import { Board } from "../Classes/board";
import { Move } from "../Classes/move";
import { Piece } from "../Classes/piece";
import { Tile } from "../Classes/tile";
import { MoveMap } from "../data/MoveMap";
import { Color } from "../enums/colorEnum";
import { Type } from "../enums/pieceEnum";
import { CheckChecker } from "./CheckChecker";

export class MoveHelper {
  static GetPawnMoves(board: Board, piece: Piece): Move[] {
    const moves: Move[] = [];
    const dx = [-1, 1];
    const x = piece.x;
    const y = piece.y;
    const dy = piece.color == Color.White ? 1 : -1;
    const startRow = piece.color == Color.White ? 1 : 6;
    const promotionRow = piece.color == Color.White ? 7 : 0;
    const enPassantRow = piece.color == Color.White ? 4 : 3;
    const possiblePromotions = [
      Type.Knight,
      Type.Bishop,
      Type.Rook,
      Type.Queen,
    ];

    if (board.board[y + dy][x].piece == null) {
      if (y + dy == promotionRow) {
        possiblePromotions.forEach((promotionType: Type) => {
          moves.push(
            new Move(piece, piece.y, piece.x, y + dy, x, {
              isPromotion: true,
              promotionType: promotionType,
            })
          );
        });
      } else {
        moves.push(new Move(piece, piece.y, piece.x, y + dy, x));
      }
      if (
        y == startRow &&
        board.board[y + 2 * dy][x].piece == null &&
        y == startRow
      ) {
        moves.push(new Move(piece, piece.y, piece.x, y + 2 * dy, x));
      }
    }

    dx.forEach((dx: number) => {
      if (x + dx < 0 || x + dx > 7) {
        return;
      }

      const landingTile: Tile = board.board[y + dy][x + dx];

      if (landingTile.piece && landingTile.piece.color != piece.color) {
        if (y + dy == promotionRow) {
          possiblePromotions.forEach((promotionType: Type) => {
            moves.push(
              new Move(piece, piece.y, piece.x, y + dy, x + dx, {
                capturedPiece: landingTile.piece,
                isPromotion: true,
                promotionType,
              })
            );
          });
        } else {
          moves.push(
            new Move(piece, piece.y, piece.x, y + dy, x + dx, {
              capturedPiece: landingTile.piece,
            })
          );
        }
      }

      const EnPassantTile: Tile = board.board[y][x + dx];

      if (
        landingTile.piece == undefined &&
        EnPassantTile.piece &&
        EnPassantTile.piece.color != piece.color &&
        EnPassantTile.piece.type == Type.Pawn &&
        y == enPassantRow
      ) {
        moves.push(
          new Move(piece, piece.y, piece.x, y + dy, x + dx, {
            capturedPiece: EnPassantTile.piece,
            isEnpassant: true,
          })
        );
      }
    });

    return moves;
  }

  static GetNonPawnMoves(board: Board, piece: Piece): Move[] {
    const moves: Move[] = [];

    MoveMap[piece.type].forEach(([dx, dy, repeatable]) => {
      let x: number = piece.x + dx;
      let y: number = piece.y + dy;
      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const landingTile: Tile = board.board[y][x];
        if (landingTile.piece) {
          if (landingTile.piece.color != piece.color) {
            moves.push(
              new Move(piece, piece.y, piece.x, y, x, {
                capturedPiece: landingTile.piece,
              })
            );
          }

          break;
        } else {
          moves.push(new Move(piece, piece.y, piece.x, y, x));
        }

        if (!repeatable) break;

        x += dx;
        y += dy;
      }
    });

    return moves;
  }

  static GetCastleMoves(board: Board, king: Piece): Move[] {
    const moves: Move[] = [];

    const startRow = king.color == Color.White ? 0 : 7;
    const startCol = 4;

    if (king.x != startCol || king.y != startRow) return [];

    const RookShortTile: Tile = board.board[king.y][7];
    const RookShort: Piece | undefined = RookShortTile.piece;
    if (
      RookShort &&
      RookShort.type == Type.Rook &&
      RookShort.color == king.color
    ) {
      if (
        board.board[king.y][5].piece == null &&
        board.board[king.y][6].piece == null
      ) {
        if (this.IsSafeForKing(board, king, 5)) {
          let move: Move = new Move(king, king.y, king.x, king.y, 6, {
            isCastle: true,
            isShortCastle: true,
          });
          moves.push(move);
        }
      }
    }

    const RookLongTile: Tile = board.board[king.y][0];
    const RookLong: Piece | undefined = RookLongTile.piece;
    if (
      RookLong &&
      RookLong.type == Type.Rook &&
      RookLong.color == king.color
    ) {
      if (
        board.board[king.y][3].piece == null &&
        board.board[king.y][2].piece == null &&
        board.board[king.y][1].piece == null
      ) {
        if (this.IsSafeForKing(board, king, 3)) {
          let move: Move = new Move(king, king.y, king.x, king.y, 2, {
            isCastle: true,
            isShortCastle: false,
          });
          moves.push(move);
        }
      }
    }

    return moves;
  }

  static IsSafeForKing(board: Board, king: Piece, x: number): boolean {
    const startTile = board.board[king.y][king.x];
    startTile.RemovePiece()

    const middleTile = board.board[king.y][x];
    middleTile.AddPiece(king)

    let startX = king.x;
    king.Move(middleTile, king.y, x);

    let checkCheck = CheckChecker.CheckCheck(board.board, king);

    king.Move(startTile, king.y, startX);
    startTile.AddPiece(king);
    middleTile.RemovePiece();

    return !checkCheck;
  }
}
