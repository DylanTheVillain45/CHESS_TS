import { Board } from "../Classes/board";
import { Move } from "../Classes/move";
import { Piece } from "../Classes/piece";
import { Tile } from "../Classes/tile";
import { MoveMap } from "../data/MoveMap";
import { Color } from "../enums/colorEnum";
import { Type } from "../enums/pieceEnum";

export class MoveHelper {
  static GetPawnMoves(board: Board, piece: Piece): Move[] {
    const moves: Move[] = []
    const dx = [-1, 1]
    const x = piece.x;
    const y = piece.y
    const dy = piece.color == Color.White ? 1 : - 1
    const startRow = piece.color == Color.White ? 1 : 6
    const promotionRow = piece.color == Color.White ? 7  : 0
    const possiblePromotions = [Type.Knight, Type.Bishop, Type.Rook, Type.Queen]

    if (board.board[y + dy][x].piece == null) {
      if (y + dy == promotionRow) {
        possiblePromotions.forEach((promotionType: Type) => {
          moves.push(new Move(piece, piece.y, piece.x, y + dy, x, {isPromotion: true, promotionType: promotionType}))
        })
      } else {
        moves.push(new Move(piece, piece.y, piece.x, y + dy, x))
      }
      if (y == startRow && board.board[y + 2 * dy][x].piece == null && y == startRow) {
        moves.push(new Move(piece, piece.y, piece.x, y + 2 * dy, x))
      }
    } 

    dx.forEach((dx: number) => {
      if (x + dx < 0 || x + dx > 7) {
        return;
      }

      const landingTile: Tile = board.board[y + dy][x + dx]

      if (landingTile.piece && landingTile.piece.color != piece.color) { 
        if (y + dy == promotionRow) {
          possiblePromotions.forEach((promotionType: Type) => {
            moves.push(new Move(piece, piece.y, piece.x, y + dy, x + dx, {capturedPiece:landingTile.piece, isPromotion: true, promotionType}))
          })
        } else {
          moves.push(new Move(piece, piece.y, piece.x, y + dy, x + dx, {capturedPiece: landingTile.piece}))
        }

      }
    });

    return moves
  }

  static GetNonPawnMoves(board: Board, piece: Piece): Move[] {
    const moves: Move[] = [];

    MoveMap[piece.type].forEach(([dx, dy, repeatable]) => {
        let x: number = piece.x + dx
        let y: number = piece.y + dy
        while(x >= 0 && x < 8 && y >= 0 && y < 8) {
          const landingTile: Tile = board.board[y][x];
          if (landingTile.piece) {
            if (landingTile.piece.color != piece.color) {
              moves.push(new Move(piece, piece.y, piece.x, y, x, {capturedPiece: landingTile.piece}))
            }

            break;
          } else {
            moves.push(new Move(piece, piece.y, piece.x, y, x))
          }
          
          if (!repeatable) break;
          
          x += dx 
          y += dy
        }
    });

    return moves;
  }
}