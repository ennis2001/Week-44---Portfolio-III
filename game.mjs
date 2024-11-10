import createMenu from "./utils/menu.mjs";
import { ANSI } from "./utils/ansi.mjs";
import { print, clearScreen } from "./utils/io.mjs";
import SplashScreen from './game/splash.mjs';
import { FIRST_PLAYER, SECOND_PLAYER } from "./consts.mjs";
import createMapLayoutScreen from "./game/mapLayoutScreen.mjs";
import createInnBetweenScreen from "./game/innbetweenScreen.mjs";
import createBattleshipScreen from "./game/battleshipsScreen.mjs";

const MAIN_MENU_ITEMS = buildMenu();
const GAME_FPS = 1000 / 60;
let mainMenuScene = null;
let currentState = null;
let nextState = null;
let gameLoopInterval = null;

const MIN_WIDTH = 80;
const MIN_HEIGHT = 24;

(function initialize() {
    checkResolutionAndInitialize();
})();

function checkResolutionAndInitialize() {
    if (!checkResolution(MIN_WIDTH, MIN_HEIGHT)) {
        console.log(`Attempting to resize console to at least ${MIN_WIDTH}x${MIN_HEIGHT}...`);
        exec(`stty rows ${MIN_HEIGHT} cols ${MIN_WIDTH}`, (error) => {
            if (error) {
                console.error("Failed to resize terminal automatically. Please resize manually and restart the game.");
                process.exit();
            } else if (checkResolution(MIN_WIDTH, MIN_HEIGHT)) {
                initializeGame();
            } else {
                console.log(`The console resolution is still too small. Please resize your terminal to at least ${MIN_WIDTH}x${MIN_HEIGHT}.`);
                process.exit();
            }
        });
    } else {
        initializeGame();
    }
}

function initializeGame() {
    print(ANSI.HIDE_CURSOR);
    clearScreen();

    currentState = SplashScreen;

    SplashScreen.start(() => {
        console.log("SplashScreen done, transitioning to Menu...");
        setNextScreen(createMenu(MAIN_MENU_ITEMS));  // Now works correctly with default import
    });

    gameLoopInterval = setInterval(gameLoop, GAME_FPS);

    console.log("Game initialized with minimum resolution:", MIN_WIDTH, "x", MIN_HEIGHT);
}

function checkResolution(minWidth, minHeight) {
    const terminalWidth = process.stdout.columns;
    const terminalHeight = process.stdout.rows;
    console.log(`Checking resolution: console width=${terminalWidth}, console height=${terminalHeight}`);

    return terminalWidth >= minWidth && terminalHeight >= minHeight;
}

function setNextScreen(newScreen) {
    nextState = newScreen;
}

function gameLoop() {
    try {
        if (nextState) {
            currentState = nextState;
            nextState = null;
            clearScreen();
            console.log("Transitioned to:", currentState?.constructor.name || 'Unnamed');
        }

        if (currentState) {
            currentState.update(GAME_FPS);
            currentState.draw(GAME_FPS);
        }
    } catch (error) {
        console.error("Error in game loop:", error);
        clearInterval(gameLoopInterval);
    }
}

function buildMenu() {
    let menuItemCount = 0;
    return [
        {
            text: "Start Game", id: menuItemCount++, action: function () {
                clearScreen();
                console.log("Start Game selected");

                // Start ship placement for Player 1
                let innbetween = createInnBetweenScreen();
                innbetween.init("SHIP PLACEMENT\nFirst player get ready.\nPlayer two look away", () => {
                    let p1map = createMapLayoutScreen();
                    p1map.init(FIRST_PLAYER, (player1ShipMap) => {
                        let innbetween2 = createInnBetweenScreen();
                        innbetween2.init("SHIP PLACEMENT\nSecond player get ready.\nPlayer one look away", () => {
                            let p2map = createMapLayoutScreen();
                            p2map.init(SECOND_PLAYER, (player2ShipMap) => {
                                // After ship placement, start the game
                                const battleshipScreen = createBattleshipScreen(player1ShipMap, player2ShipMap);
                                setNextScreen(battleshipScreen);
                            });
                            setNextScreen(p2map); // Set next screen to player 2 map
                        });
                        setNextScreen(innbetween2); // Set next screen to second inn-between screen
                    });
                    setNextScreen(p1map); // Set next screen to player 1 map
                }, 3);
                setNextScreen(innbetween); // Set initial screen to first inn-between screen
            }
        },
        { 
            text: "Exit Game", 
            id: menuItemCount++, 
            action: function () { 
                print(ANSI.SHOW_CURSOR); 
                clearScreen(); 
                process.exit(); 
            } 
        }
    ];
}
