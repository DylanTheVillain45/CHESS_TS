import { Tile } from "./tile";

export class Game {
    board: Tile[][];

    constructor(boardEl: Element) {
        this.board = this.CreateBoard(boardEl);
    }

    CreateBoard(boardEl: Element): Tile[][] {
        const board: Tile[][] = []

        for (let i = 7; i >= 0; i--) {
            let row: Tile[] = []
            for (let j = 0; j < 8; j++) {
                let tile = new Tile(i, j, boardEl)
                if (i == 0 || i == 1 || i == 7 || i == 8) {
                    let isWhite == 
                }
                row.push(tile)
            }
            board.push(row)
        }

        return board
    }
}