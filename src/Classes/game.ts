import { Color } from "../enums/colorEnum";
import { Type } from "../enums/pieceEnum";
import { Piece } from "./piece";
import { Tile } from "./tile";
import { Board } from "./board";

export class Game {
    board: Board;
    color: Color;

    constructor(boardEl: HTMLDivElement) {
        this.board = new Board(boardEl)
        this.color = Color.White;
        this.board.GetMoves(this.color);
    }
}