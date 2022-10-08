const vscode = require('vscode');

let outputChannel = vscode.window.createOutputChannel('tfmodblock');
let output = function (msg) {
    const outMsg = `${getNow()} ${msg}`;
    outputChannel.appendLine(outMsg);
    return outMsg;
}

function getNow() {
    const date = new Date();
    return date.toISOString();
}

module.exports = {
    output,
}
