import type { Piece } from "./piece";

export class Tile {
    row: number;
    col: number;
    el: Element;
    piece: Piece | null;

    constructor(row : number, col : number, boardEl: Element) {
        this.row = row;
        this.col = col;
        this.el = document.createElement("div");
        this.el.id = `${row}-${col}`
        this.el.classList.add("tile", `${(row + col) % 2 == 0 ? "black" : "white"}`);
        boardEl.appendChild(this.el)
        this.piece = null;
    }
}