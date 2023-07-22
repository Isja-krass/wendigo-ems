/**
 * ===[ INFO ]==================================================================
 * @brief Enables logging into a textfile
 * @created 02-08-2022@22:30:12.722
 * @author isja_krass
 * @version 0.0.1
 * =============================================================================
 */

// INCLUDE default libs
const FS = require("fs");

/// EXPORT MASTERCLASS///
module.exports = class {

    /**
     * Creates a new instance of the fslogger.
     * Use the flag to determine writing behavior
     * @param {string} path path to the file
     * @param {"a"|"w"|"g"|"q"|"z"} flag write flag
     */
    constructor (path, flag) {
        if (!FS.existsSync(path)) {
            FS.appendFileSync(path, "");
        };
        this.handle = FS.createWriteStream(path, {flags: flag});
        this.handle.write(`<<< LOGFILE::streamBegin@${new Date().toLocaleDateString()} >>>\n`, (err) => {
            if (err) {
                throw {name: "0x10", class: "ERR_GENERAL_FS_FAIL", message: `fail to write stream at '${path}', file is blocked by an other application`};
            };
        });
    };

    /**
     * Adds a  data package to the logstream
     * @param {string} data data to write
     */
    append (data) {
        this.handle.write(data + "\n", (err) => {
            if (err) {
                throw {name: "0x10", class: "ERR_GENERAL_FS_FAIL", message: `fail to write stream at '${path}', file is blocked by an other application`};
            };
        });
    };

    /**
     * Coses the logstream (if needed)
     */
    close () {
        this.handle.end(`<<< LOGFILE::streamEnded@${new Date().toLocaleDateString()} >>>\n\n`);
    };

};