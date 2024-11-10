import { GAME_BOARD_DIM } from "../consts.mjs";

// Initialize a game board
function createBoard() {
    const board = Array(GAME_BOARD_DIM).fill(null).map(() => Array(GAME_BOARD_DIM).fill(null));
    return board;
}

// Mark a shot on the board (hit or miss)
function markShot(board, x, y, isHit) {
    board[x][y] = isHit ? 'X' : 'O';  // 'X' for hit, 'O' for miss
}

// Display a board
function displayBoard(board) {
    let display = "\n";
    for (let row of board) {
        display += row.map(cell => (cell ? cell : '.')).join(' ') + "\n";
    }
    return display;
}

// Check if all ships are sunk
function checkIfAllShipsSunk(board) {
    return board.every(row => row.every(cell => cell !== 'S' && cell !== null));  // Assume 'S' is a ship
}

export { createBoard, markShot, displayBoard, checkIfAllShipsSunk };
