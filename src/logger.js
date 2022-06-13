const vscode = require('vscode');

let outputChannel = vscode.window.createOutputChannel('tfmodblock');
let output = function (msg) {
    outputChannel.appendLine(`${msg}`);
}

module.exports = {
    output,
}
