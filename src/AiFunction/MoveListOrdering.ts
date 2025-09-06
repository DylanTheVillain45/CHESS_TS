import { Move } from "../Classes/move";
import { PieceValue } from "../data/PieceValue";

export class MoveListOrdering {
  static OrderForABPrune(moves: Move[]): Move[] {
    return moves.sort((a, b) => this.ScoreMove(b) - this.ScoreMove(a))
  }

  static ScoreMove(move: Move): number {
    let score = 0;

    if (move.isPromotion && move.promotionType) return score += 1000000 + PieceValue[move.promotionType];
    if (move.isCapture && move.capturedPiece) score += 10000 + 10 * PieceValue[move.capturedPiece.type] - PieceValue[move.piece.type];
    if (move.isCheck) score += 5000;
    return score;
  }
}
