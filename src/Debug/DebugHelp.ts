import { Tile } from "../Classes/tile";

export class DebugHelp {
    static ConsoleBoard(board: Tile[][]) {
        for (let i = 7; i >= 0; i--) {
            let rowString =""
            for (let j = 0; j < 8; j++) {
                const tile: Tile = board[i][j]
                rowString += `${tile.x}${tile.y}${tile.piece ? (`${tile.piece.color[0]}${tile.piece.type[0]}`) : ("XX")} `
            }
            console.log(rowString)
        }
    }
}