import { Color } from "../enums/colorEnum";
import { Type } from "../enums/pieceEnum";
import { Piece } from "./piece";
import { Tile } from "./tile";
import { Board } from "./board";
import { Move } from "./move";
import { MoveHandler } from "../ChessFunction/MoveHandler";
import { MoveExecuter } from "../ChessFunction/MoveExecuter";
import { MoveFilter } from "../ChessFunction/MoveFilter";
import { CheckChecker } from "../ChessFunction/CheckChecker";

export class Game {
  board!: Board;
  color!: Color;
  currentMoves!: Move[];
  moveHandler!: MoveHandler;
  moveExecuter!: MoveExecuter;
  moveFilter!: MoveFilter;
  promotionalModal!: HTMLDivElement;

  constructor(boardEl: HTMLDivElement, promotionModal: HTMLDivElement) {
    this.SetUpBoard(boardEl, promotionModal);
  }

  MakeMove(move: Move) {
    this.moveExecuter.MakeMove(move);
    this.color = this.color == Color.White ? Color.Black : Color.White;
    this.GetSetMoves(this.color);
  }

  GetSetMoves(color: Color) {
    const filteredMoves = this.GetMoves(color);
    this.SetMoves(filteredMoves);
    // console.log(this.currentMoves)
  }

  GetMoves(color: Color): Move[] {
    let unfilteredMoves = this.board.GetMoves(color);
    let filteredMoves = this.moveFilter.FilterMoves(unfilteredMoves, color);
    return filteredMoves;
  }

  SetMoves(moves: Move[]) {
    this.currentMoves = moves;
    this.moveHandler.SetMoveList(moves, this.color);
  }

  OpenModal(callback: (type: Type) => void) {
    this.promotionalModal.style.display = "block";

    const buttons = this.promotionalModal.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.onclick = () => {
        const piece = (btn as HTMLButtonElement).dataset.piece!;
        let type: Type;

        switch (piece) {
          case "rook":
            type = Type.Rook;
            break;
          case "bishop":
            type = Type.Bishop;
            break;
          case "knight":
            type = Type.Knight;
            break;
          default:
            type = Type.Queen;
        }

        this.promotionalModal.style.display = "none";
        callback(type);
      };
    });
  }

  SetUpBoard(boardEl: HTMLDivElement, promotionModal: HTMLDivElement) {
    this.promotionalModal = promotionModal;
    this.color = Color.White;
    this.moveHandler = new MoveHandler(
      this.color,
      this.MakeMove.bind(this),
      this.OpenModal.bind(this)
    );
    this.board = new Board(
      boardEl,
      this.moveHandler.HandleClick.bind(this.moveHandler)
    );
    this.moveHandler.SetBoard(this.board.board);
    this.moveExecuter = new MoveExecuter(this.board.board, false);
    this.moveFilter = new MoveFilter(
      this.board.board,
      this.board.whiteKing,
      this.board.blackKing,
      this.moveExecuter.MakeMove.bind(this.moveExecuter),
      this.moveExecuter.UnMakeMove.bind(this.moveExecuter),
      CheckChecker.CheckCheck
    );

    this.GetSetMoves(this.color);
  }
}
