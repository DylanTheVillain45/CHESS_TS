import { Move } from "../Classes/move";
import { Tile } from "../Classes/tile";
import { Color } from "../enums/colorEnum";
import { Type } from "../enums/pieceEnum";

export class MoveHandler {
  currentTile: Tile | null;
  currentMove: Move | null;
  moveList!: Move[];
  turn: Color;
  board!: Tile[][];
  highlightedTiles: [number, number][];

  constructor(
    color: Color,
    private MakeMove: (move: Move) => void,
    private OpenModal: (callback: (type: Type) => void) => void
  ) {
    this.currentTile = null;
    this.currentMove = null;
    this.turn = color;
    this.highlightedTiles = [];
    this.MakeMove = MakeMove;
    this.OpenModal = OpenModal;
  }

  SetBoard(board: Tile[][]) {
    this.board = board;
  }

  SetMoveList(moveList: Move[], color: Color) {
    this.moveList = moveList;
    this.turn = color;
  }

  GetMoveEnd(tile: Tile): [number, number][] {
    const endMoves: Move[] = this.moveList.filter(
      (move: Move) => move.startX == tile.x && move.startY == tile.y
    );
    const endMovesCord: [number, number][] = endMoves.map((move: Move) => [
      move.endX,
      move.endY,
    ]);

    return endMovesCord;
  }

  HandleClick(tile: Tile) {
    const isOwnPiece = tile.piece && tile.piece.color == this.turn;
    const hasSelectedTile = this.currentTile != null;

    if (isOwnPiece) {
      const possibleMoves: [number, number][] = this.GetMoveEnd(tile);

      if (possibleMoves.length > 0) {
        if (this.currentTile) {
          this.UnHighlightCurrent([this.currentTile.x, this.currentTile.y]);
        }
        this.currentTile = tile;
        this.HightlightCurrent([tile.x, tile.y]);
        this.highlightedTiles.forEach((coords) => this.UnHighLightTile(coords));
        this.HighlightPosTiles(possibleMoves);
      }

      return;
    }

    if (hasSelectedTile) {
      const isHighlighted = this.highlightedTiles.some(
        ([x, y]) => x == tile.x && tile.y == y
      );

      if (isHighlighted && this.currentTile) {
        this.highlightedTiles.forEach((coords) => this.UnHighLightTile(coords));
        let move: Move | undefined = this.GetMoveFromCords(
          this.currentTile.x,
          this.currentTile.y,
          tile.x,
          tile.y
        );
        if (move) {
          this.currentMove = move;
          if (move.isPromotion) {
            this.OpenModal(this.HandlePromotion);
          }

          this.UnHighlightCurrent([this.currentTile.x, this.currentTile.y]);
          this.MakeMove(move);
        }

        this.UnHighlightCurrent([this.currentTile.x, this.currentTile.y]);
        this.currentTile = null;
        this.currentMove = null;
      }
    }
  }

  HandlePromotion(type: Type) {
    if (!this.currentMove || !this.currentTile) {
      throw new Error("MOVE / TILE NOT INITIALIZED");
    }

    this.currentMove.promotionType = type;

    
    this.UnHighlightCurrent([this.currentTile.x, this.currentTile.y]);
    this.MakeMove(this.currentMove);
    this.currentTile = null;
    this.currentMove = null;
  }

  GetMoveFromCords(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): Move | undefined {
    const move = this.moveList.find(
      (move: Move) =>
        move.startX === startX &&
        move.startY === startY &&
        move.endX === endX &&
        move.endY === endY
    );

    return move;
  }

  HighlightPosTiles(endCords: [number, number][]) {
    endCords.forEach((cord: [number, number]) => {
      this.highlightedTiles.push(cord);
      this.HighLightTile(cord);
    });
  }

  HighLightTile(cord: [number, number]) {
    this.board[cord[1]][cord[0]].el.classList.add("highlighted");
  }

  HightlightCurrent(cord: [number, number]) {
    this.board[cord[1]][cord[0]].el.classList.add("current");
  }

  UnHighlightCurrent(cord: [number, number]) {
    this.board[cord[1]][cord[0]].el.classList.remove("current");
  }

  UnHighLightTile(cord: [number, number]) {
    this.board[cord[1]][cord[0]].el.classList.remove("highlighted");
  }
}
