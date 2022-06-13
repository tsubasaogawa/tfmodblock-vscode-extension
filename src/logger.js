const vscode = require('vscode');

let outputChannel = vscode.window.createOutputChannel('tfmodblock');
let output = function (msg) {
    outputChannel.appendLine(`${getNow()} ${msg}`);
}

function getNow() {
    const date = new Date();
    return date.toISOString();
}

module.exports = {
    output,
}
