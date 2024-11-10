import { printCentered, clearScreen } from "../utils/io.mjs";

const UI = ` ######                                    #####
 #     #   ##   ##### ##### #      ###### #     # #    # # #####   ####
 #     #  #  #    #     #   #      #      #       #    # # #    # #
 ######  #    #   #     #   #      #####   #####  ###### # #    #  ####
 #     # ######   #     #   #      #            # #    # # #####       #
 #     # #    #   #     #   #      #      #     # #    # # #      #    #
 ######  #    #   #     #   ###### ######  #####  #    # # #       ####
                                                                         `;

let isDrawn = false;
let countdown = 2500;
let onDoneCallback = null;

const SplashScreen = {
    start(callback) {
        onDoneCallback = callback;
        countdown = 2500;
        isDrawn = false;
    },

    update(dt) {
        countdown -= dt;
        if (countdown <= 0 && onDoneCallback) {
            console.log("Splash Screen done, transitioning to next screen...");
            onDoneCallback();
            onDoneCallback = null;
        }
    },

    draw() {
        if (!isDrawn) {
            isDrawn = true;
            clearScreen();
            printCentered(UI);
        }
    }
};

export default SplashScreen;
