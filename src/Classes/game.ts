import { Color } from "../enums/colorEnum";
import { Type } from "../enums/pieceEnum";
import { Board } from "./board";
import { Move } from "./move";
import { MoveHandler } from "../ChessFunction/MoveHandler";
import { MoveExecuter } from "../ChessFunction/MoveExecuter";
import { MoveFilter } from "../ChessFunction/MoveFilter";
import { CheckChecker } from "../ChessFunction/CheckChecker";
import { Agent } from "../AiFunction/Agent";

export class Game {
  board!: Board;
  color!: Color;
  currentMoves!: Move[];
  moveLog: [Move, Move | null][] = [];
  moveHandler!: MoveHandler;
  moveExecuter!: MoveExecuter;
  moveFilter!: MoveFilter;

  boardElement: HTMLDivElement;
  promotionalModal: HTMLDivElement;
  restartButton: HTMLElement;
  undoMove: HTMLElement;
  reverseBoard: HTMLElement;
  depthSelector: HTMLSelectElement;
  outcomeText: HTMLDivElement

  Agent!: Agent;
  isAiMove: boolean = false;
  aiDepth: number = 2;

  constructor(
    boardElement: HTMLDivElement,
    promotionModal: HTMLDivElement,
    restartButton: HTMLElement,
    undoMove: HTMLElement,
    reverseBoard: HTMLElement,
    depthSelector: HTMLSelectElement,
    outcomeText: HTMLDivElement
  ) {
    this.boardElement = boardElement;
    this.promotionalModal = promotionModal;
    this.restartButton = restartButton;
    this.undoMove = undoMove;
    this.reverseBoard = reverseBoard;
    this.depthSelector = depthSelector;
    this.outcomeText = outcomeText
    this.SetUpBoard();
    this.SetUpButtons();
  }

  SetUpButtons() {
    this.restartButton.onclick = () => this.SetUpBoard();
    this.undoMove.onclick = () => {
      this.outcomeText.textContent = ""
      this.UnMakeMove(this.GetLastMove());
      this.UnMakeMove(this.GetLastMove());
      this.GetSetMoves(this.color);
    };
    this.reverseBoard.onclick = () => {
      this.SetUpBoard();
      this.boardElement.classList.toggle("rotated");
      if (this.boardElement.classList.contains("rotated")) {
        this.isAiMove = true;
        this.HandleAiMove();
      }
    };
    this.depthSelector.onchange = () => {
      this.aiDepth = Number.parseInt(this.depthSelector.value);
    };
  }

  GetLastMove(): Move {
    let move1 = this.moveLog[this.moveLog.length - 1][0];
    let move2 = this.moveLog[this.moveLog.length - 1][1];

    if (move2 == null && move1) {
      return move1;
    } else if (move2) {
      return move2;
    } else {
      throw new Error("move null");
    }
  }

  HandlePlayerMove(move: Move) {
    this.MakeMove(move);
    this.GetSetMoves(this.color);
    this.isAiMove = true;
    this.HandleAiMove();
  }

  HandleAiMove() {
    let move = this.Agent.GetBestMove(
      this.aiDepth,
      this.color,
      this.currentMoves
    );
    this.MakeMove(move[0]);
    // console.log(move[1]);
    this.GetSetMoves(this.color);
    this.isAiMove = false;
  }

  HandleCheckMate() {
    this.outcomeText.textContent = `CHECKMATE - ${(this.color == Color.White ? Color.Black : Color.White).toUpperCase()} WINS`;}

  HandleStaleMate() {
    this.outcomeText.textContent = "STALEMATE - DRAW";}

  IsCheck(color: Color): boolean {
    return CheckChecker.CheckCheck(
      this.board.board,
      CheckChecker.FindKing(this.board.board, color)
    );
  }

  MakeMove(move: Move) {
    this.moveExecuter.MakeMove(move);
    if (move.piece.color == Color.White) {
      this.moveLog.push([move, null]);
    } else {
      this.moveLog[this.moveLog.length - 1][1] = move;
    }

    this.color = this.color == Color.White ? Color.Black : Color.White;
  }

  UnMakeMove(move: Move) {
    this.moveExecuter.UnMakeMove(move);
    if (move.piece.color == Color.White) {
      this.moveLog.pop();
    } else {
      this.moveLog[this.moveLog.length - 1][1] = null;
    }

    this.color = this.color == Color.White ? Color.Black : Color.White;
  }

  GetSetMoves(color: Color) {
    const filteredMoves = this.GetMoves(color);
    this.SetMoves(filteredMoves);
  }

  GetMoves(color: Color, IsAi: boolean = false): Move[] {
    let unfilteredMoves = this.board.GetMoves(color);
    let filteredMoves = this.moveFilter.FilterMoves(
      unfilteredMoves,
      color,
      this.HandleCheckMate.bind(this),
      this.HandleStaleMate.bind(this),
      this.IsCheck.bind(this),
      IsAi,
    );
    return filteredMoves;
  }

  SetMoves(moves: Move[]) {
    this.currentMoves = moves;
    this.moveHandler.SetMoveList(moves, this.color);
  }

  OpenModal(callback: (move: Move) => void, move: Move) {
    this.promotionalModal.classList.add("show");
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

        this.promotionalModal.classList.add("show");
        this.promotionalModal.style.display = "none";
        move.promotionType = type;
        callback(move);
      };
    });
  }

  SetUpBoard() {
    this.outcomeText.textContent = ""
    this.boardElement.classList.remove("rotated");
    this.boardElement.innerHTML = "";
    this.moveLog = [];
    this.color = Color.White;

    this.moveHandler = new MoveHandler(
      this.color,
      this.HandlePlayerMove.bind(this),
      this.OpenModal.bind(this)
    );

    this.board = new Board(
      this.boardElement,
      this.moveHandler.HandleClick.bind(this.moveHandler),
      this.moveLog
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
    this.Agent = new Agent(
      this.board.board,
      this.MakeMove.bind(this),
      this.UnMakeMove.bind(this),
      this.GetMoves.bind(this),
      this.IsCheck.bind(this)
    );

    this.GetSetMoves(this.color);
  }
}
