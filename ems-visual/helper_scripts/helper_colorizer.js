/**
 * ===[ INFO ]==================================================================
 * @brief Colorize an given array structure
 * @created 02-08-2022@21:04:54.488
 * @author isja_krass
 * @version 0.0.1
 * =============================================================================
 */

/// EXPORT MASTER FUNCTION ///
/**
 * Colorize an given input by centrain metatags
 * @param {object} input[] array segments input
 * @param {"danger"|"good"|"dissabeld"|"neutral"|"grayed"|"error"|"operation"|"info"} input.role color role
 * @param {string} input.text text to be colorized
 * @param {string} theme choose a color theme
 * @param {boolean} [dissable] true if you want to bypass the colorizor
 * @output {string}
 */
module.exports = function (input, theme, dissable) {

    var out = "";
    if (dissable) {
        input.forEach(segment => {
            out = out + segment.text
        });
    } else {
        var currentTheme = {};
        currentTheme = require("../colorthemes.json")[theme];
        input.forEach(segment => {
            out = out + currentTheme[segment.role] + segment.text + "\u001b[0m";
        });
    };
    return out

};