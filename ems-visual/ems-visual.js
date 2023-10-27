/**
 * ===[ INFO ]==================================================================
 * @brief The consoleinterface++ module from the PAUL toolkit portrtet to javascript.
 * @created 03-08-2022@14:21:12.125
 * @author isja_krass
 * @version 0.0.1
 * =============================================================================
 */

// INCLUDE helper_scripts
const colorizer = require("./helper_scripts/helper_colorizer");
const chrono = require("./helper_scripts/helper_chrono");
const fslogger = require("./helper_scripts/helper_fslogger");
const largeFont = require("./helper_scripts/helper_largeFont");
const RID = require("./helper_scripts/helper_iniReader");

/// EXPORT MASTER MODULE ///
module.exports = class {

    /**
     * Creates a new consoleinterface instance from class.
     * Options are passed trougth the constructor, but also can be changed directly in the code-flow when needed.
     * @param {object} options options for creating the consoleinterface
     * @param {boolean} options.useFormatting enable ANSI-escape-code formatting (default: true)
     * @param {boolean} options.useTimestamps enable human readable timestamps (default: true)
     * @param {"all"|"warning"|"error"|"fatal"} options.globalLogLevel glabal log event filtering (default: 'all')
     * @param {string} options.colorTheme choose a color theme (default:  'neo-console')
     * @param {string} options.ignoreClasses[] ignore speziffic event and error classes (default: none)
     * @param {"local"|"date-now"|"onlytime"} options.chrono set the chrono-shematic used for console timestamps (default: 'local')
     * @param {number} options.chronoLength maximum timestamp length to enshure an uniform look
     * @param {number} options.genericAnimationTick Overall console animation tick (default: 100ms)
     * @param {"none"|"typenwriter"} options.animation decorative animation (default: 'none')
     * @param {boolean} options.enableDebug enable debugging messages (default: false)
     */
    constructor (options) {

        // check defualt values
        if (options == undefined) {options = {}};
        if (options.useFormatting == undefined) {this.useFormatting = true} else {this.useFormatting = options.useFormatting};
        if (options.useTimestamps == undefined) {this.useTimestamps = true} else {this.useTimestamps = options.useTimestamps};
        if (typeof options.globalLogLevel != "string") {this.globalLogLevel = "all"} else {this.globalLogLevel = options.globalLogLevel};
        if (typeof options.colorTheme != "string") {this.colorTheme = "neo-console"} else {this.colorTheme = options.colorTheme};
        if (typeof options.ignoreClasses == "undefined") {this.ignoreClasses = []} else {this.ignoreClasses = options.ignoreClasses};
        if (typeof options.chrono != "string") {this.chrono = "local"} else {this.chrono = options.chrono};
        if (typeof options.genericAnimationTick != "number") {this.genericAnimationTick = 30} else {this.genericAnimationTick = options.genericAnimationTick};
        if (options.chronoLength == 0  || !options.chronoLength || typeof chronoLength != "number") {this.chronoLength = 12} else {this.chronoLength = options.chronoLength};
        if (typeof options.animation != "string") {this.animation = "none"} else {this.animation = options.animation};
        if (options.enableDebug == undefined) {this.enableDebug = false} else {this.enableDebug = options.enableDebug};

        // default values for logfile
        this.logfile = {
            logUserinput: false,
            path: "",
            includeTimestamps: true,
            logVisualision: false,
            logLevel: "warning",
            ignoreClasses: [],
        };

    };

    /**
     * Initialise the File-Logger. The file logger enables events to be logged in a file for later diagnostics
     * or the archive. REMEMBER: if a file already saved it will be overwritten!
     * @param {string} path filepath where the logfile will be written
     * @param {object} options options passed to the file-logger
     * @param {boolea} options.includeTimestamps enables the use of timestamps in the logfile 
     * @param {boolean} options.logUserinput controls if user input should be present in the logfile (default: false)  
     * @param {boolean} options.logVisualision controls if visualision like prograss-bars or tables should be present in the logfile (default: false)
     * @param {"all"|"warning"|"error"|"fatal"} options.logLevel level of the logfile (default: "warning")
     * @param {string} options.ignoreClasses[] ignore speziffic classes for the logfile (default: none)
     * @param {boolean} options.includeDebug include debug information in the logfile
     */
    initLogfile (path, options) {
        if (options == undefined) {options = {}};
        this.logfile.path = path;
        if (typeof options.logUserinput == "boolean") {this.logfile.logUserinput = options.logUserinput};
        if (typeof options.includeTimestamps == "boolean") {this.logfile.includeTimestamps = options.includeTimestamps};
        if (typeof options.logVisualision == "boolean") {this.logfile.logVisualision = options.logVisualision};
        if (options.ignoreClasses == undefined) {this.logfile.tignoreClasses = options.ignoreClasses};
        if (typeof options.logLevel == "string") {this.logfile.logLevel = options.logLevel};
        if (typeof options.includeDebug == "boolean") {this.includeDebug = options.includeDebug};
        this.fsloggerHandle = new fslogger(this.logfile.path, "a");
    };

    /**
     * Closes the logifile and shuts down the stream
     */
    dropLogfile () {
        this.fsloggerHandle.close();
    };

    /**
     * Directly writes a message or output bypassing all fancy functions and sub-modules.
     * @param {any} message data to write
     */
    cout (message) {
        switch (this.animation) {
            default: 
                process.stdout.write(message + "");
            break;
            case "typenwriter":
                var msgArray = message.split("");
                var step = 0
                var intervall = setInterval(() => {
                    if (step == msgArray.length) {
                        clearInterval(intervall);
                    } else {
                        process.stdout.write(msgArray[step] + "");
                        step++;
                    };
                }, this.genericAnimationTick);
            break;
        };
    };

    /**
     * Displays and logs a simple message in the console.
     * @param {any} message message to write
     */
    log (message) {
        if (this.globalLogLevel == "warning" || this.globalLogLevel == "error" || this.globalLogLevel == "fatal") {
            return;
        } else {
            if (this.logfile.path != "") {
                if (this.logfile.logLevel != "warning" && this.logfile.logLevel != "error" && this.logfile.logLevel != "fatal") {
                    this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + " " + message);
                };
            };
            this.cout(colorizer([
                {role: "grayed", text: chrono(this.chrono, this.chronoLength, !this.useTimestamps)},
                {role: "neutral", text: message},
            ], this.colorTheme, !this.useFormatting) + "\n");
        };
    };

    /**
     * Displays and loggs a simple warning message in the console.
     * @param {string} message warning message
     */
    logWarning (message) {
        if (this.globalLogLevel == "error" || this.globalLogLevel == "fatal") {
            return;
        } else {
            if (this.logfile.path != "") {
                if (this.logfile.logLevel != "error" && this.logfile.logLevel != "fatal") {
                    this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + " !WRN: " + message);
                };
            };
            this.cout(colorizer([
                {role: "grayed", text: chrono(this.chrono, this.chronoLength, !this.useTimestamps)},
                {role: "danger", text: "!WRN"},
                {role: "neutral", text: ": "},
                {role: "grayed", text: message},
            ], this.colorTheme, !this.useFormatting) + "\n");
        };
    };

    /**
     * Displays and loggs a simple error message.
     * @param {number} code Error- or ErrorFamily code numeric
     * @param {string} errClass Error class / descriptor
     * @param {string} message An error message to inform the user what went wrong
     * @returns {object} Error inforamtion for handlers
     */
    logError (code, errClass, message) {
        if (this.globalLogLevel == "fatal" && this.ignoreClasses.includes(errClass)) {
            return;
        } else {
            if (this.logfile.path != "") {
                if (!this.logfile.ignoreClasses.includes(errClass)) {
                    if (this.logfile.logLevel != "fatal"){
                        this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + " !ERR: [" + code + "]" + errClass + ":: " + message);   
                    };
                };
            };
            if (!this.ignoreClasses.includes(errClass)) {
                this.cout(colorizer([
                    {role: "grayed", text: chrono(this.chrono, this.chronoLength, !this.useTimestamps)},
                    {role: "error", text: "!ERR"},
                    {role: "neutral", text: ": ["},
                    {role: "info", text: code},
                    {role: "neutral", text: "]"},
                    {role: "error", text: errClass},
                    {role: "neutral", text: ":: "},
                    {role: "dissabeld", text: message}
                ], this.colorTheme, !this.useFormatting) + "\n");
            };
        };
        return {name: errClass, message: message, stack: ""};
    };

    /**
     * Displays an event and its parameters.
     * @param {string} duct Name of the specific duct the event occurs on.
     * @param {string} name Name of the event itself.
     * @param {string} description Event description.
     */
    logEvent (duct, name, description) {
        if (this.globalLogLevel == "warning" || this.globalLogLevel == "error" || this.globalLogLevel == "fatal") {
            return;
        };
        if (this.logfile.path != "") {
            if (this.logfile.logLevel == "all") {
                this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [EVENT]: ${name}@${duct} | ${description}`);
            };
        };
        this.cout(colorizer([
            {role: "grayed", text: chrono(this.chrono, this.chronoLength, !this.useTimestamps)},
            {role: "operation", text: "EVENT"},
            {role: "neutral", text: ": "},
            {role: "info", text: name},
            {role: "dissabeld", text: " @ "},
            {role: "danger", text: duct}
        ], this.colorTheme, !this.useFormatting) + "\n");
        var spacer = chrono(this.chrono, this.chronoLength, !this.useTimestamps).length;
        var emptySpace = "";
        for (var i = 0; i < spacer; i++) {
            emptySpace = emptySpace  + " ";
        };
        this.cout(colorizer([
            {role: "neutral", text: emptySpace + "─┰───"},
        ], this.colorTheme, !this.useFormatting) + "\n");
        this.cout(colorizer([
            {role: "neutral", text: emptySpace + " ┗━━━ "},
            {role: "dissabeld", text: "META: "},
            {role: "neutral", text: description}
        ], this.colorTheme, !this.useFormatting) + "\n");
    };
    
    /**
     * Displays an operation and informs about the status of every subfunction.
     * @param {"still"|"oneshot"|"event"|"loop"} trigger Describes how the operation was triggerd.
     * @param {string} descriptor Describes the operation (AKA "opration_class").
     * @param {object} data[] Data returned from the operation.
     * @param {string} data.name[] Name of the subfunction.
     * @param {string} data.descriptor Description of what was done.
     * @param {bool} data.successor Subfunction ended with a success.
     * @param {bool} success Operation was successfull.
     */
    operation (trigger, descriptor, data, success) {
        if (this.globalLogLevel == "warning" || this.globalLogLevel == "error" || this.globalLogLevel == "fatal") {
            return;
        };
        if (this.logfile.path != "") {
            if (this.logfile.logLevel == "all") {
                if (this.logfile.logVisualision) {
                    this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [OPERATION]: ${trigger}|${descriptor} >> ${success}`);
                    data.forEach(element => {
                        var successE = "";
                        if (element.successor) {successE = "SUCCESS"} else {successE = "FAIL"};
                        this.fsloggerHandle.append(`     ╠═ ${element.name}:: ${element.descriptor} >> ${successE}`); 
                    });
                } else {
                    this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [OPERATION]: ${trigger}|${descriptor} >> ${success}`);
                    data.forEach(element => {
                        var successE = "";
                        if (element.successor) {successE = "SUCCESS"} else {successE = "FAIL"};
                        this.fsloggerHandle.append(`=> ${element.name}:: ${element.descriptor} >> ${successE}`);   
                    });
                };
            };
        };
        this.cout(colorizer([
            {role: "grayed", text: chrono(this.chrono, this.chronoLength, !this.useTimestamps)},
            {role: "operation", text: "OPERATION"},
            {role: "neutral", text: ": "},
            {role: "info", text: trigger},
            {role: "neutral", text: "|"},
            {role: "dissabeld", text: descriptor}
        ], this.colorTheme, !this.useFormatting) + "\n");
        var spacer = chrono(this.chrono, this.chronoLength, !this.useTimestamps).length;
        var emptySpace = "";
        for (var i = 0; i < spacer; i++) {
            emptySpace = emptySpace  + " ";
        };
        this.cout(colorizer([
            {role: "neutral", text: emptySpace + "───┰─────"},
        ], this.colorTheme, !this.useFormatting) + "\n");
        data.forEach(element => {
            if (element.successor) {
                this.cout(colorizer([
                    {role: "neutral", text: emptySpace + "   ┣ "},
                    {role: "operation", text: element.name},
                    {role: "neutral", text: ": "},
                    {role: "grayed", text: element.descriptor},
                    {role: "neutral", text: " >> "},
                    {role: "good", text: "SUCCESS"}
                ], this.colorTheme, !this.useFormatting) + "\n");
            } else {
                this.cout(colorizer([
                    {role: "neutral", text: emptySpace + "   ┣ "},
                    {role: "operation", text: element.name},
                    {role: "neutral", text: ": "},
                    {role: "grayed", text: element.descriptor},
                    {role: "neutral", text: " >> "},
                    {role: "error", text: "FAIL"}
                ], this.colorTheme, !this.useFormatting) + "\n");
            };
        });
        if (success) {
            this.cout(colorizer([
                {role: "neutral", text: emptySpace + "   ┗━━━ "},
                {role: "dissabeld", text: "RESULT: "},
                {role: "good", text: "OPERATION SUCCESS"}
            ], this.colorTheme, !this.useFormatting) + "\n");
        } else {
            this.cout(colorizer([
                {role: "neutral", text: emptySpace + "   ┗━━━ "},
                {role: "dissabeld", text: "RESULT: "},
                {role: "error", text: "OPERATION FAILED"}
            ], this.colorTheme, !this.useFormatting) + "\n");
        }
    };

    /**
     * Ask the user to enter a value ant returns it as string.
     * @param {boolean} [displayPräambel] toggles the Präambel (default: true)
     * @returns {Promise<string>} Input given by the user as string
     */
    getString (displayPräambel) {
        if (displayPräambel || displayPräambel == undefined) {
            this.cout(colorizer([
                {role: "dissabeld", text: "INPUT"},
                {role: "neutral", text: " ["},
                {role: "info", text: "string"},
                {role: "neutral", text: "] << "},
            ], this.colorTheme, !this.useFormatting)); 
        };
        return new Promise((resolve, reject) => {
            var linstener = process.stdin.on("data", (rawData) => {
                var input = rawData.toString();if (this.logfile.path != "" && this.logfile.logUserinput) {
                    this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                };
                if (input.lengt == 0 || input == undefined || input == null) {
                    reject(null);
                    linstener.destroy();
                    if (this.logfile.path != "" && this.logfile.logUserinput) {
                        this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: input was 'undefined' or 'null'`);
                    };
                } else {
                    resolve(input.replace(/\n/g, ""));
                    linstener.destroy();
                    if (this.logfile.path != "" && this.logfile.logUserinput) {
                        this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'string':: ${input}`);
                    };
                };
            });
        });
    };

    /**
     * Ask the user to enter a value ant returns it as number.
     * @param {boolean} [displayPräambel] toggles the Präambel (default: true)
     * @returns {Promise<number>} Input given by the user as number
     */
    getNumber (displayPräambel) {
        if (displayPräambel || displayPräambel == undefined) {
            this.cout(colorizer([
                {role: "dissabeld", text: "INPUT"},
                {role: "neutral", text: " ["},
                {role: "info", text: "number"},
                {role: "neutral", text: "] << "},
            ], this.colorTheme, !this.useFormatting)); 
        };
        return new Promise((resolve, reject) => {
            var listener = process.stdin.on("data", (rawData) => {
                var input = rawData.toString();
                if (input.length == 0 || input == undefined || input == null) {
                    reject(null);
                    listener.destroy();
                    if (this.logfile.path != "" && this.logfile.logUserinput) {
                        this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: input was 'undefined' or 'null'`);
                    };
                } else {
                    var numberResolved = Number(input.replace(/\n/g, ""));
                    listener.destroy();
                    if (numberResolved == NaN) {
                        if (this.logfile.path != "" && this.logfile.logUserinput) {
                            this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: was not able to resolve 'number' out of '${input}' >> reject NULL `);
                        };
                        reject(null);
                    } else { 
                        resolve(numberResolved);
                    };
                    
                }; 
            });
        });

    };

    /**
     * Ask the user to enter a value ant returns it as boolean.
     * @param {boolean} displayPräambel toggles the Präambel (default: true)
     * @returns {Promise<boolean>} Input given by the user as boolean
     */
    getBool (displayPräambel) {
        if (displayPräambel || displayPräambel == undefined) {
            this.cout(colorizer([
                {role: "dissabeld", text: "INPUT"},
                {role: "neutral", text: " ["},
                {role: "info", text: "bool"},
                {role: "neutral", text: "] << "},
            ], this.colorTheme, !this.useFormatting)); 
        };
        return new Promise((resolve, reject) => {
            var listener = process.stdin.on("data", (rawData) => {
                var input = rawData.toString().replace(/\n/g, "").toLocaleLowerCase();
                if (input.length == 0 || input == null || input == undefined) {
                    reject(null);
                    listener.destroy();
                    if (this.logfile.path != "" && this.logfile.logUserinput) {
                        this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: input was 'undefined' or 'null'`);
                    };
                } else {
                    switch (input) {
                        default: 
                            reject(null);
                            listener.destroy();
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: was not able to resolve 'bool' out of '${input}' >> reject NULL `);
                            };
                        break;
                        case "true":
                            listener.destroy();
                            resolve(true);
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                        case "false":
                            listener.destroy();
                            resolve(false);
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                        case "yes":
                            listener.destroy();
                            resolve(true);
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                        case "no":
                            listener.destroy();
                            resolve(false);
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                        case "0":
                            listener.destroy();
                            resolve(false);
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                        case "1":
                            listener.destroy();
                            resolve(true);
                            if (this.logfile.path != "" && this.logfile.logUserinput) {
                                this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + ` [USER-INPUT]: as 'bool':: ${input}`);
                            };
                        break;
                    };
                };
            });
        });
    };

    /**
     * Writes a large unicede-blockfont header
     * @param {string} title input text
     * @param {string} [role] colorizer role 
     */
    writeHeader(title, role) {
        var out = largeFont(title);
        if (role == "" || role == undefined) { role = "neutral" };
        if (this.logfile.path != "" && this.logfile.logVisualision) {
            out.split("\n").forEach(outputLine => {
                this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + outputLine);
            });
        };
        this.cout(colorizer([
            {role: role, text: out}
        ], this.colorTheme, !this.useFormatting));
    };

    /**
     * Writes a simple list consisting of an display name followed by an parameter
     * @param {Array<object>} data array of data to display
     * @param {string} data.name parameter display name 
     * @param {any} data.value value of the parameter
     * @param {number} spacer space between the parameter name and the value, should be larger than the length of the longest parameter name
     */
    writeList (data, spacer) {
        var output = [];
        data.forEach(element => {
            var spacerCalc = spacer - element.name.length;
            var spacerAdd = "";
            for (var i = 0; i < spacerCalc; i++) {
                spacerAdd = spacerAdd + " ";
            };
            output.push({role: "neutral", text: element.name + ":" + spacerAdd});
            output.push({role: "info", text: element.value + "\n"});
            if (this.logfile.path != "" && this.logfile.logVisualision) {
                this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + element.name + ":" + spacerAdd + element.value);
            };
        });
        this.cout(colorizer(output, this.colorTheme, !this.useFormatting));
    };

    /**
     * Prints a  debug message or notification
     * @param {any} message debug message
     */
    debug (message) {
        if (this.enableDebug) {
            if (this.logfile.path != "") {
                if (this.includeDebug) {
                    this.fsloggerHandle.append(chrono(this.chrono, this.chronoLength, !this.logfile.includeTimestamps) + "DEBUG: " + message + " ['" + typeof message + "']");   
                };
            };    
            this.cout(colorizer([
                {role: "grayed", text: chrono(this.chrono, this.chronoLength, !this.useTimestamps)},
                {role: "good", text: " DEBUG"},
                {role: "neutral", text: ": "},
                {role: "dissabeld", text: message}
            ], this.colorTheme, !this.useFormatting) + "\n");
        };
    };

};