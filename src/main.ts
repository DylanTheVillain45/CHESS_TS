import "./style.css";
import { Game } from "./Classes/game";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>CHESS</h1>
    <div id="board">
      
    </div>
    <div id="promotionModal" style="display: none; position: absolute; top: 50%; left: 50%; 
      transform: translate(-50%, -50%); background: white; padding: 10px; border: 2px solid black;">
      <button data-piece="queen">Queen</button>
      <button data-piece="rook">Rook</button>
      <button data-piece="bishop">Bishop</button>
      <button data-piece="knight">Knight</button>
    </div>
  </div>
`;

const boardEl: HTMLElement | null = document.getElementById("board");
const promotionSelector: HTMLElement | null = document.getElementById("promotionModal")

if (boardEl && boardEl instanceof HTMLDivElement && promotionSelector && promotionSelector instanceof HTMLDivElement) {
  const game = new Game(boardEl, promotionSelector);
}
