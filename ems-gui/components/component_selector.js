const PCS = require("process");

/**
 * Draws an selection Box in the middle of the screen.
 * @param {object} inputData Select data. 
 * @param {string} inputData.title Title of the selecton.
 * @param {Array<object>} inputData.items Select options.
 * @param {string} inputData.items.name Name of the option.
 * @param {boolean} inputData.items.selected Indicates if the iptions is selected.
 */
module.exports.drawSimpleSelect = function (inputData) {

    // find the logest string in the the provided data
    var longestOption = inputData.title.split("\n")[0].length;
    inputData.items.forEach(item => {
        var lengtNow = item.name.length;
        if (lengtNow > longestOption) longestOption = lengtNow;
    });

    // calculate possition
    var posX = 0;
    var posY = 0;
    var offsetNow = 0;
    var oversizedX = false;
    var scrollY = false;
    var estimatedPromptHeight = 5 + inputData.items.length + (inputData.title.split("\n").length);
    var estimatedPromtWidth = 5 + longestOption;
    if (estimatedPromptHeight > PCS.stdout.rows) scrollY = true;
    if (estimatedPromtWidth > PCS.stdout.columns) oversizedX = true;
    if (!scrollY) posY = Math.floor((PCS.stdout.rows / 2) - (estimatedPromptHeight / 2));
    if (!oversizedX) posX = Math.floor((PCS.stdout.columns / 2) - (estimatedPromtWidth / 2));

    // difine drawing space
    const ctx = PCS.stdout;

    // draw selector
    ctx.cursorTo(posX, posY);
    ctx.write("╔══");
    for (var i = 0; i < longestOption; i++) ctx.write("═");
    ctx.write("═╗");
    offsetNow ++;
    inputData.title.split("\n").forEach(titleLine => {
        var lineFiller = "";
        for (var n = 0; n < longestOption - titleLine.length; n++) lineFiller += " ";
        ctx.cursorTo(posX, posY + offsetNow);
        ctx.write(`║\u001b[1;38;5;15m ${titleLine} ${lineFiller} \u001b[0m║`);
        offsetNow++;
    });
    ctx.cursorTo(posX, posY + offsetNow);
    ctx.write(`╟──`);
    for (var i = 0; i < longestOption; i++) ctx.write("─");
    ctx.write(`─╢`);
    offsetNow++;
    ctx.cursorTo(posX, posY + offsetNow);
    ctx.write(`║  `);
    for (var i = 0; i < longestOption; i++) ctx.write(" ");
    ctx.write(` ║`);
    inputData.items.forEach(item => {
        offsetNow++;
        ctx.cursorTo(posX, posY + offsetNow);
        if (item.selected) {
            ctx.write(`║ \u001b[1;7m⮚`);
        } else {
            ctx.write(`║  `);
        };
        var lineFiller = "";
        for (var n = 0; n < longestOption - item.name.length; n++) lineFiller += " ";
        ctx.write(`${item.name}${lineFiller}\u001b[0m ║`);
    });
    offsetNow++;
    ctx.cursorTo(posX, posY + offsetNow);
    ctx.write(`║  `);
    for (var i = 0; i < longestOption; i++) ctx.write(" ");
    ctx.write(` ║`);
    offsetNow++;
    ctx.cursorTo(posX, posY + offsetNow);
    ctx.write("╚══");
    for (var i = 0; i < longestOption; i++) ctx.write("═");
    ctx.write("═╝");
    ctx.cursorTo(0, 0);

};

*//
module.exports.simpleSelect = function (title, items) {
    return new Promise((resolve, reject) => {

        // keep track of menue status
        var selectedItem = 0;
        var itemMax = 0;
        var statusNow = {title: "", items: []};

        // assemble menue status the ferst time
        if (typeof title != "string") reject({code: 206, errClass: "ERR_SELECTOR_NO_TITLE", message: `title of the selector not defined or using wrong type, expected: 'string', got: '${typeof title}'`});
        statusNow.title = title;
        if (typeof items != "object") reject({code: 206, errClass: "ERR_SELECTOR_ITEMS", message: `selector has wrong or undefined items, expected: 'object', got: '${typeof title}'`});
        itemMax = items.length - 1;
        statusNow.items = structuredClone(items);
        statusNow.items[0].selected = true;

        // listen to user keystrokes
        PCS.stdin.setRawMode(true);
        PCS.stdin.resume();
        var keylistener = PCS.stdin.on("data", chunk => {

            // exit if esc is pressed
            if (chunk[0] == 0x1b && chunk.length == 1) {
                PCS.stdin.setRawMode(false);
                PCS.stdin.resume();
                keylistener.destroy();
                resolve(null);
            };

            // check if enter is pressed
            if (chunk[0] == 0x0d) {
                PCS.stdin.setRawMode(false);
                PCS.stdin.resume();
                keylistener.destroy();
                resolve(items[selectedItem].value);
            };

            // arrow up is pressed
            if (chunk[0] == 0x1b && chunk[1] == 0x5b && chunk[2] == 0x41) {
                if (selectedItem != 0) selectedItem--;
            };

            // arrow down is pressed
            if (chunk[0] == 0x1b && chunk[1] == 0x5b && chunk[2] == 0x42) {
                if (selectedItem != itemMax) selectedItem++;
            };

            // update status
            statusNow.items.forEach(itemNow => {
                itemNow.selected = false;
            });
            statusNow.items[selectedItem].selected = true;

            // redraw the component
            this.drawSimpleSelect(statusNow);

        });


        // draw the component the first time
        this.drawSimpleSelect(statusNow);

    });
};