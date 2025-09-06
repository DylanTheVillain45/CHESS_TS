import { Tile } from "../Classes/tile";
import { Color } from "../enums/colorEnum";
import { PST } from "../data/PST";
import { PieceValue } from "../data/PieceValue";
import { Type } from "../enums/pieceEnum";
import { PhaseValues } from "../data/Phase";

export class Evaluation {
  static EvalBoard(board: Tile[][]): number {
    let [whiteScore, blackScore] = this.FindMaterialScore(board);

    return whiteScore - blackScore;
  }

  static FindMaterialScore(board: Tile[][]): [number, number] {
    let blackScore = 0;
    let whiteScore = 0;
    let phase = 0;
    let blackKing, whiteKing;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j].piece;
        if (!piece) continue;

        phase += PhaseValues[piece.type];
        let value = PieceValue[piece.type];

        const pst = PST[piece.type];

        if (piece.type == Type.King) {
          piece.color == Color.White
            ? (whiteKing = piece)
            : (blackKing = piece);
          continue;
        }

        let pstValue =
          pst.Mid[piece.color == Color.White ? 7 - piece.y : piece.y][piece.x];

        if (piece.color == Color.White) {
          whiteScore += value + pstValue;
        } else {
          blackScore += value + pstValue;
        }
      }
    }

    if (!whiteKing || !blackKing) {
      throw new Error("Kings not found");
    }

    const pst = PST[Type.King];
    const phaseRatio = Math.max(0, Math.min(1, phase / 24));
    whiteScore +=
      phaseRatio * pst.Mid[7 - whiteKing.y][whiteKing.x] +
      (1 - phaseRatio) * pst.End[7 - whiteKing.y][whiteKing.x];
    blackScore +=
      phaseRatio * pst.Mid[blackKing.y][blackKing.x] +
      (1 - phaseRatio) * pst.End[blackKing.y][blackKing.x];
    // console.log(whiteScore);
    // console.log(blackScore);

    return [whiteScore, blackScore];
  }
}
