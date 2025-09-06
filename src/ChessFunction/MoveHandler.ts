import { Move } from "../Classes/move";
import { Tile } from "../Classes/tile";
import { Color } from "../enums/colorEnum";

export class MoveHandler {
  currentTile: Tile | null;
  moveList!: Move[];
  turn: Color;
  board!: Tile[][];
  highlightedTiles: [number, number][];

  constructor(
    color: Color,
    private MakeMove: (move: Move) => void,
    private OpenModal: (callback: (move: Move) => void, move: Move) => void
  ) {
    this.currentTile = null;
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
          if (move.isPromotion) {
            return this.OpenModal(this.HandlePromotion.bind(this), move);
          }

          this.UnHighlightCurrent([this.currentTile.x, this.currentTile.y]);
          this.MakeMove(move);
        }

        this.UnHighlightCurrent([this.currentTile.x, this.currentTile.y]);
        this.currentTile = null;
      }
    }
  }

  HandlePromotion(move: Move) {
    console.log(this.currentTile)
    if (this.currentTile == null) {
      throw new Error("TILE NOT INITIALIZED");
    }
    
    this.UnHighlightCurrent([this.currentTile.x, this.currentTile.y]);
    this.MakeMove(move);
    this.currentTile = null;
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
