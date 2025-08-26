import './style.css'
import { Game } from './Classes/game'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>CHESS</h1>
    <div id="board">
      
    </div>
  </div>
`

const boardEl = document.getElementById("board")

const game = new Game(boardEl)
