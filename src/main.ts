import "./style.css";
import { Game } from "./Classes/game";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div style="display: flex; flex-direction: column; align-items: center;">
    <h1>CHESS</h1>

    <!-- Controls -->
    <div id="controls" style="margin-top: -20px; margin-bottom: 10px; display: flex; gap: 15px; align-items: center;">
      <!-- Back Arrow -->
      <button id="undoMove" style="font-size: 18px;">⬅ Undo</button>

      <!-- Depth Selector -->
      <label for="depthSelect">Depth:</label>
      <select id="depthSelect">
        <option value="1">1</option>
        <option value="2" selected>2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>

      <!-- Reverse Board -->
      <button id="reverseBoardBtn">Reverse Board</button>
      <!-- Restart Button -->
      <button id="restartBtn" style="color: red; font-weight: bold;">Restart</button>

    </div>

    </div>

    <!-- Chessboard -->
    <div id="board"></div>

    <!-- Promotion Modal -->
    <div id="promotionModal" 
      style="display: none; position: absolute; top: 50%; left: 50%; 
      transform: translate(-50%, -50%); background: white; padding: 10px; 
      border: 2px solid black; z-index: 100;">
      <p>Choose promotion:</p>
      <button data-piece="queen">Queen</button>
      <button data-piece="rook">Rook</button>
      <button data-piece="bishop">Bishop</button>
      <button data-piece="knight">Knight</button>
    </div>
  </div>
`;

const boardEl: HTMLElement | null = document.getElementById("board");
const promotionSelector: HTMLElement | null =
  document.getElementById("promotionModal");
const depthSelector: HTMLElement | null =
  document.getElementById("depthSelect");
const undoMove: HTMLElement | null = document.getElementById("undoMove");
const reverseBoard: HTMLElement | null =
  document.getElementById("reverseBoardBtn");
const restartButton: HTMLElement | null = document.getElementById("restartBtn")

if (
  boardEl &&
  boardEl instanceof HTMLDivElement &&
  promotionSelector &&
  promotionSelector instanceof HTMLDivElement &&
  depthSelector &&
  depthSelector instanceof HTMLSelectElement &&
  undoMove &&
  undoMove instanceof HTMLElement &&
  reverseBoard &&
  reverseBoard instanceof HTMLElement &&
  restartButton &&
  restartButton instanceof HTMLElement
) {
  const game = new Game(
    boardEl,
    promotionSelector,
    restartButton,
    undoMove,
    reverseBoard,
    depthSelector,
  );
}
