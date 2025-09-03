import type { Piece } from "./piece";

export class Tile {
  x: number;
  y: number;
  el: HTMLDivElement;
  piece?: Piece;

  constructor(
    col: number,
    row: number,
    boardEl: HTMLDivElement,
    private HandleClick: (tile: Tile) => void
  ) {
    this.x = row;
    this.y = col;
    this.el = document.createElement("div");
    this.el.id = `${row}-${col}`;
    this.el.classList.add(
      "tile",
      `${(row + col) % 2 == 0 ? "black" : "white"}`
    );
    // this.el.textContent = `${this.x}, ${this.y}`;
    boardEl.appendChild(this.el);
    this.el.addEventListener("click", () => {
      this.HandleClick(this);
    });
  }

  AddPiece(piece: Piece) {
    this.piece = piece;
    this.el.classList.add(
      `${this.piece.color.toLowerCase()}-${this.piece.type.toLowerCase()}`
    );
  }

  RemovePiece() {
    this.piece = undefined;
    this.el.classList.remove(
      ...Array.from(this.el.classList).filter((c) => c.includes("-"))
    );
  }
}
