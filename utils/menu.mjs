import { ANSI } from "../utils/ansi.mjs";
import KeyBoardManager, { clearScreen } from "../utils/io.mjs";
import { printCentered } from "../utils/io.mjs";

// Default export for createMenu
export default function createMenu(menuItems) {
    let currentActiveMenuItem = 0;  // Tracks the current highlighted menu item

    return {
        isDrawn: false,

        update: function (dt) {
            if (KeyBoardManager.isUpPressed()) {
                currentActiveMenuItem = (currentActiveMenuItem - 1 + menuItems.length) % menuItems.length;
                this.isDrawn = false;  // Redraw when the active item changes
            } else if (KeyBoardManager.isDownPressed()) {
                currentActiveMenuItem = (currentActiveMenuItem + 1) % menuItems.length;
                this.isDrawn = false;  // Redraw when the active item changes
            } else if (KeyBoardManager.isEnterPressed()) {
                if (menuItems[currentActiveMenuItem].action) {
                    menuItems[currentActiveMenuItem].action();  // Execute the action associated with the menu item
                }
            }
        },

        draw: function () {
            if (!this.isDrawn) {
                this.isDrawn = true;
                clearScreen();
                let output = "";

                // Loop through menu items to display each one, highlighting the current selection
                for (let index in menuItems) {
                    let menuItem = menuItems[index];
                    let title = menuItem.text;

                    if (currentActiveMenuItem == menuItem.id) {
                        title = `*${menuItem.text}*`;  // Highlight the active item
                    } else {
                        title = ` ${menuItem.text} `;
                    }

                    output += title + "\n";
                }

                printCentered(output);  // Centered display of the menu
            }
        }
    };
}
