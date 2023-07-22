/**
 * ===[ INFO ]==================================================================
 * @brief Reader for '*.ini' configuration files. 
 * @created 21-10-2022@19:10:33.016
 * @author isja_krass
 * @version 0.0.1
 * =============================================================================
 */

// REQUIRE native modules
const FIS = require("fs");

/// EXPORT MASTER MODULE ///
module.exports = {

    /**
     * Reads the entire '*.ini' file and returns its content as object
     * @param {string} filePath File path, where the  file is located
     * @returns {Promise} config data
     */
    read: function (filePath) {
        return  new Promise ((resolve) => {
            var inFile = FIS.readFileSync(filePath);
            var output = {};
            if (inFile == undefined) {throw {code: 0x44, name: "ERR_FS_READFILE", message: `could not open and read file '${filePath}', eher blocked or open by an other application`}};
            inFile.toString().split("\n").forEach(lineBuffer => {
                if (!lineBuffer.startsWith("#") && lineBuffer.length != 0) {
                    if (lineBuffer.split("=")[1].startsWith(`'`) && lineBuffer.split("=")[1].endsWith(`'`)) {
                        output[lineBuffer.split("=")[0]] = lineBuffer.split("=")[1].replace("'", "");
                    } else if (lineBuffer.split("=")[1].match(/^[0-9.]*$/g)) {
                        output[lineBuffer.split("=")[0]] = Number(lineBuffer.split("=")[1]);
                    } else if (lineBuffer.split("=")[1] == "true" || lineBuffer.split("=")[1] == "false") {
                        output[lineBuffer.split("=")[0]] = (lineBuffer.split("=")[1] === "true");
                    };
                };
            });
            resolve(output);
        });
    },

};