import { Move } from "../Classes/move";
import { Tile } from "../Classes/tile";
import { Color } from "../enums/colorEnum";
import { Evaluation } from "./Evaluation";
import { MoveListOrdering } from "./MoveListOrdering";

export class Agent {
  board: Tile[][];
  MateScore: number = 1000000;

  constructor(
    board: Tile[][],
    private MakeMove: (move: Move) => void,
    private UnMakeMove: (move: Move) => void,
    private GetMoves: (color: Color) => Move[],
    private IsCheck: (color: Color) => boolean
  ) {
    this.board = board;
    this.MakeMove = MakeMove;
    this.UnMakeMove = UnMakeMove;
    this.GetMoves = GetMoves;
    this.IsCheck = IsCheck;
  }

  GetEvalutation(): number {
    return Evaluation.EvalBoard(this.board);
  }

  SortMoveList(moves: Move[]): Move[] {
    return MoveListOrdering.OrderForABPrune(moves);
  }

  GetSortedMoveList(color: Color): Move[] {
    return this.SortMoveList(this.GetMoves(color));
  }

  GetBestMove(
    maxDepth: number,
    maximizingColor: Color,
    moveList: Move[]
  ): [Move, number] {
    let bestScore = Number.MIN_SAFE_INTEGER;
    let alpha = Number.MIN_SAFE_INTEGER;
    let beta = Number.MAX_SAFE_INTEGER;
    let bestMove: Move | undefined = undefined;

    const minimizingColor =
      maximizingColor == Color.White ? Color.Black : Color.White;

    const orderedMoves = this.SortMoveList(moveList);

    for (let move of orderedMoves) {
      this.MakeMove(move);

      let score = this.Beta(
        maxDepth - 1,
        maxDepth,
        maximizingColor,
        minimizingColor,
        alpha,
        beta
      );

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }

      alpha = Math.max(alpha, bestScore);
      this.UnMakeMove(move);
    }

    if (bestMove == undefined) {
      throw new Error("No moves");
    }

    return [bestMove, bestScore];
  }

  Alpha(
    depth: number,
    maxDepth: number,
    maximizingColor: Color,
    minimizingColor: Color,
    alpha: number,
    beta: number
  ): number {
    if (depth <= 0) {
      return this.GetEvalutation() * (maximizingColor == Color.White ? 1 : -1);
    }

    const sortedMoves = this.GetSortedMoveList(maximizingColor);
    if (sortedMoves.length == 0) {
      if (this.IsCheck(maximizingColor)) {
        // console.log("checkmate")
        return -this.MateScore + 100 * (maxDepth - depth);
      }
      return 0;
    }

    let bestScore = Number.MIN_SAFE_INTEGER;

    for (let move of sortedMoves) {
      this.MakeMove(move);

      let score = this.Beta(
        depth - 1,
        maxDepth,
        maximizingColor,
        minimizingColor,
        alpha,
        beta
      );

      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, bestScore);

      this.UnMakeMove(move);

      if (beta <= alpha) break;
    }

    return bestScore;
  }

  Beta(
    depth: number,
    maxDepth: number,
    maximizingColor: Color,
    minimizingColor: Color,
    alpha: number,
    beta: number
  ): number {
    if (depth <= 0) {
      return this.GetEvalutation() * (maximizingColor == Color.White ? 1 : -1);
    }

    const sortedMoves = this.GetSortedMoveList(minimizingColor);

    if (sortedMoves.length == 0) {
      if (this.IsCheck(minimizingColor)) {
        // console.log("checkmate")
        return this.MateScore - 100 * (maxDepth - depth);
      }
      return 0;
    }

    let bestScore = Number.MAX_SAFE_INTEGER;

    for (let move of sortedMoves) {
      this.MakeMove(move);

      let score = this.Alpha(
        depth - 1,
        maxDepth,
        maximizingColor,
        minimizingColor,
        alpha,
        beta
      );

      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, bestScore);

      this.UnMakeMove(move);

      if (beta <= alpha) break;
    }

    return bestScore;
  }
}
