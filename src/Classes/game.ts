import { Color } from "../enums/colorEnum";
import { Type } from "../enums/pieceEnum";
import { Piece } from "./piece";
import { Tile } from "./tile";
import { Board } from "./board";
import { Move } from "./move";
import { MoveHandler } from "../ChessFunction/MoveHandler";

export class Game {
    board: Board;
    color: Color;
    currentMoves: Move[];
    moveHandler: MoveHandler;

    constructor(boardEl: HTMLDivElement) {
        this.color = Color.White;
        this.moveHandler = new MoveHandler(this.color, this.MakeMove.bind(this))
        this.board = new Board(boardEl, this.moveHandler.HandleClick.bind(this.moveHandler))
        this.moveHandler.SetBoard(this.board.board)

        this.currentMoves = this.board.GetMoves(this.color);
        this.moveHandler.SetMoveList(this.currentMoves)
    }

    MakeMove(move: Move) {
    }
}