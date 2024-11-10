import { print, clearScreen } from "../utils/io.mjs";
import { ANSI } from "../utils/ansi.mjs";
import { printCentered } from "../utils/io.mjs"; // Import the centering function

// Removed the gameBoard.mjs import as it's not needed for now

function createBattleshipScreen(player1ShipMap, player2ShipMap) {
    return {
        update: function () {
            // Game loop logic for updating the screen
            console.log("Updating Battleship screen...");
            console.log("Player 1's Ship Board:", player1ShipMap);
            console.log("Player 2's Ship Board:", player2ShipMap);

            // Implement the game logic for turns and hit/miss checks here
        },
        draw: function () {
            // Clear screen before drawing the boards
            clearScreen();

            // Center and print Player 1's board
            printCentered("Player 1's Board:");
            printCentered(printBoard(player1ShipMap));

            // Add space between the boards
            console.log(""); // Newline for spacing

            // Center and print Player 2's board
            printCentered("Player 2's Board:");
            printCentered(printBoard(player2ShipMap));
        }
    };
}

// Helper function to print boards (this will depend on how your ship maps are stored)
function printBoard(board) {
    return board.map(row => printCentered(row.join(" "))).join("\n"); // Center each row
}

export default createBattleshipScreen;
