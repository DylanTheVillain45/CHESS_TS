import type { Piece } from "./piece";

export class Tile {
  x: number;
  y: number;
  el: HTMLDivElement;
  piece: Piece | null;

  constructor(row: number, col: number, boardEl: HTMLDivElement) {
    this.x = row;
    this.y = col;
    this.el = document.createElement("div");
    this.el.id = `${row}-${col}`;
    this.el.classList.add(
      "tile",
      `${(row + col) % 2 == 0 ? "black" : "white"}`
    );
    boardEl.appendChild(this.el);
    this.piece = null;
  }

  AddPiece(piece: Piece) {
    this.piece = piece;

    this.el.classList.remove(
      ...Array.from(this.el.classList).filter((c) => c.includes("-"))
    );
    this.el.classList.add(`${this.piece.color.toLowerCase()}-${this.piece.type.toLowerCase()}`);
  }
}