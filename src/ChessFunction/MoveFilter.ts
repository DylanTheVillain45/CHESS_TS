import { Move } from "../Classes/move";
import { Piece } from "../Classes/piece";
import { Tile } from "../Classes/tile";
import { Color } from "../enums/colorEnum";

export class MoveFilter {
  board: Tile[][];
  whiteKing: Piece;
  blackKing: Piece;

  constructor(
    board: Tile[][],
    whiteKing: Piece,
    blackKing: Piece,

    private makeMove: (move: Move) => void,
    private unMakeMove: (move: Move) => void,
    private checkCheck: (tile: Tile[][], kingPiece: Piece) => boolean
  ) {
    this.board = board;
    this.whiteKing = whiteKing;
    this.blackKing = blackKing;
    this.makeMove = makeMove;
    this.unMakeMove = unMakeMove;
    this.checkCheck = checkCheck;
  }

  FilterMoves(
    moves: Move[],
    color: Color,
    handleCheckMate: (string: string) => void,
    handleStalemate: (string: string) => void,
    checkCheck: (color: Color) => boolean,
    isAi: boolean
  ) {
    const myKing: Piece =
      color == Color.White ? this.whiteKing : this.blackKing;
    const opKing: Piece =
      color == Color.White ? this.blackKing : this.whiteKing;

    const newMoves: Move[] = [];

    for (const move of moves) {
      this.makeMove(move);

      let isMyCheck: boolean = this.checkCheck(this.board, myKing);

      if (isMyCheck) {
        this.unMakeMove(move);
        continue;
      }

      let isTheirCheck: boolean = this.checkCheck(this.board, opKing);

      if (isTheirCheck) {
        this.HandleMoveCheck(move);
      }

      newMoves.push(move);
      this.unMakeMove(move);
    }

    if (newMoves.length == 0 && !isAi) {
      if (checkCheck(color)) {
        handleCheckMate("CheckMate");
      } else {
        handleStalemate("StaleMate");
      }
    }

    return newMoves;
  }

  HandleMoveCheck(move: Move) {
    move.isCheck = true;
  }
}