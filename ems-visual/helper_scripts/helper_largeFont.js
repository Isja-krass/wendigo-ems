/**
 * ===[ INFO ]==================================================================
 * @file ./src/largeFont.js
 * @brief Dilpays an input test in a large unicode-block font 
 * @created 09-09-2022@20:28:17.333
 * @author isja_krass
 * @version 0.0.1
 * =============================================================================
 */

// DEFINE textart pattern
const FONT = {
    "fontHeight": 5,
        "a": [
            " █████  ",
            "██   ██ ",
            "███████ ",
            "██   ██ ",
            "██   ██ "
        ],
        "b": [
            "██████  ",
            "██   ██ ",
            "██████  ",
            "██   ██ ",
            "██████  "
        ],
        "c": [
            " █████  ",
            "██   ██ ",
            "██      ",
            "██   ██ ",
            " █████  "
        ],
        "d": [
            "█████   ",
            "██  ██  ",
            "██   ██ ",
            "██  ██  ",
            "█████   "
        ],
        "e": [
            "███████ ",
            "██      ",
            "███████ ",
            "██      ",
            "███████ "
        ],
        "f": [
            "███████ ",
            "██      ",
            "███████ ",
            "██      ",
            "██      "
        ],
        "g": [
            " █████  ",
            "██      ",
            "██  ███ ",
            "██   ██ ",
            " █████  "
        ],
        "h": [
            "██   ██ ",
            "██   ██ ",
            "███████ ",
            "██   ██ ",
            "██   ██ "
        ],
        "i": [
            "██ ",
            "██ ",
            "██ ",
            "██ ",
            "██ "
        ],
        "j": [
            "     ██ ",
            "     ██ ",
            "     ██ ",
            "██   ██ ",
            " █████  "
        ],
        "k": [
            "██  ██ ",
            "██ ██  ",
            "████   ",
            "██ ██  ",
            "██  ██ "
        ],
        "l": [
            "██      ",
            "██      ",
            "██      ",
            "██      ",
            "███████ "
        ],
        "m": [
            "██     ██ ",
            "████ ████ ",
            "██ ███ ██ ",
            "██     ██ ",
            "██     ██ "
        ],
        "n": [
            "██    ██ ",
            "████  ██ ",
            "██ ██ ██ ",
            "██  ████ ",
            "██    ██ "
        ],
        "o": [
            " ██████  ",
            "██    ██ ",
            "██    ██ ",
            "██    ██ ",
            " █████   "
        ],
        "p": [
            "███████  ",
            "██    ██ ",
            "███████  ",
            "██       ",
            "██       "
        ],
        "q": [
            " ██████  ",
            "██    ██ ",
            "██ ██ ██ ",
            " ██████  ",
            "    ██   "
        ],
        "r": [
            "███████  ",
            "██    ██ ",
            "███████  ",
            "██ ██    ",
            "██  ██   "
        ],
        "s": [
            " ██████  ",
            "██       ",
            " ██████  ",
            "      ██ ",
            " ██████  "
        ],
        "t": [
            "████████ ",
            "   ██    ",
            "   ██    ",
            "   ██    ",
            "   ██    "
        ],
        "u": [
            "██    ██ ",
            "██    ██ ",
            "██    ██ ",
            "██    ██ ",
            " ██████  "
        ],
        "V": [
            "██    ██ ",
            "██    ██ ",  
            " ██  ██  ",
            "  ████   ",
            "   ██    "
        ],
        "w": [
            "██      ██ ",
            "██      ██ ",
            "██  ██  ██ ",
            "██  ██  ██ ",
            " ███  ███  "
        ],
        "x": [
            "██   ██ ",
            " ██ ██  ",
            "  ███   ",
            " ██ ██  ",
            "██   ██  "
        ],
        "y": [
            "██    ██ ",
            " ██  ██  ",
            "  ████   ",
            "   ██    ",
            "   ██    "
        ],
        "z": [
            "████████ ",
            "     ██  ",
            "   ██    ",
            " ██      ",
            "███████  "
        ],
        " ": [
            "        ",
            "        ",
            "        ",
            "        ",
            "        "
        ]
}


/// EXPORT MADTER FUNCTION //
/**
 * Displays a string in a large unicode-block font
 * @param {string} text input text, letters a-zA-Z are supported
 */
module.exports = function (text) {
    const input = text.replace(/[^a-zA-Z ]/g, "").toLocaleLowerCase();
    var out = "";
    for (var row = 0; row < FONT.fontHeight; row++) {
        input.split("").forEach(col => {
            out = out + FONT[col][row];
        });
        out = out + "\n";
    };
    return out;
};