import { Move } from "../Classes/move";
import { Tile } from "../Classes/tile";
import { DebugHelp } from "../Debug/DebugHelp";
import { Type } from "../enums/pieceEnum";

export class MoveExecuter {
  board: Tile[][];
  isAiMove: boolean;
  isMoving: boolean = false;

  constructor(
    board: Tile[][],
    isAiMove: boolean = false,
  ) {
    this.board = board;
    this.isAiMove = isAiMove;
  }

  MakeMove(move: Move) {
    let startX = move.startX;
    let startY = move.startY;
    let endX = move.endX;
    let endY = move.endY;

    let startTile: Tile = this.board[startY][startX];
    let endTile: Tile = this.board[endY][endX];

    if (!startTile.piece || startTile.piece != move.piece) {
      console.log(move);
      DebugHelp.ConsoleBoard(this.board);
      throw new Error("Start Tile doesn't contain piece");
    }

    const piece = startTile.piece;

    if (move.isPromotion) {
      if (move.promotionType) {
        piece.type = move.promotionType;
      }
    }

    if (move.isCapture) {
      if (move.isEnpassant) {
        const enPassantTile = this.board[startY][endX];
        enPassantTile.RemovePiece();
      } else {
        endTile.RemovePiece();
      }
    }

    startTile.RemovePiece();
    endTile.AddPiece(piece);

    if (move.isCastle) {
      if (move.isShortCastle) {
        const rookTileSquare = this.board[piece.y][7];
        const rook = rookTileSquare.piece;
        rookTileSquare.RemovePiece();

        const rookEnd = this.board[piece.y][5];
        if (rook) {
          rookEnd.AddPiece(rook);
          rook.Move(rookEnd, piece.y, 5);
        }
      } else {
        const rookTileSquare = this.board[piece.y][0];
        const rook = rookTileSquare.piece;
        rookTileSquare.RemovePiece();

        const rookEnd = this.board[piece.y][3];
        if (rook) {
          rookEnd.AddPiece(rook);
          rook.Move(rookEnd, piece.y, 3);
        }
      }
    }

    piece.Move(endTile, endY, endX);
  }

  UnMakeMove(move: Move) {
    let startX = move.startX;
    let startY = move.startY;
    let endX = move.endX;
    let endY = move.endY;

    let startTile: Tile = this.board[startY][startX];
    let endTile: Tile = this.board[endY][endX];

    if (!endTile.piece || endTile.piece != move.piece) {
      throw new Error("End Tile doesn't contain piece");
    }

    const piece = endTile.piece;

    if (move.isPromotion) {
      piece.type = Type.Pawn;
    }

    endTile.RemovePiece();
    startTile.AddPiece(piece);
    piece.Move(startTile, startY, startX);

    if (move.capturedPiece) {
      if (move.isEnpassant) {
        const enpassantTile: Tile = this.board[startY][endX];
        enpassantTile.AddPiece(move.capturedPiece);
      } else {
        endTile.AddPiece(move.capturedPiece);
      }
    }

    if (move.isCastle) {
      if (move.isShortCastle) {
        const rookTileSquare = this.board[piece.y][5];
        const rook = rookTileSquare.piece;
        rookTileSquare.RemovePiece();

        const rookEnd = this.board[piece.y][7];
        if (rook) {
          rookEnd.AddPiece(rook);
          rook.Move(rookEnd, piece.y, 7);
        }
      } else {
        const rookTileSquare = this.board[piece.y][3];
        const rook = rookTileSquare.piece;
        rookTileSquare.RemovePiece();

        const rookEnd = this.board[piece.y][0];
        if (rook) {
          rookEnd.AddPiece(rook);
          rook.Move(rookEnd, piece.y, 0);
        }
      }
    }
  }
}
