// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const child_process = require('child_process');
const { utimes } = require('fs');
const config = vscode.workspace.getConfiguration('tfmodblock');

let outputChannel = vscode.window.createOutputChannel('tfmodblock');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tfmodblock-vscode-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('tfmodblock-vscode-extension.copyModuleBlockSnippet', function () {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		if (editor == null) {
			throw new Error();
		}
		let currentFilePath = editor.document.fileName;
		let currentDir = path.dirname(currentFilePath);
		const binPath = config.binPath;

		// run tfmodblock
		console.log(binPath);

		child_process.exec(`${binPath} ${currentDir}`, (error, stdout, stderr) => {
			outputChannel.appendLine(stdout);
			outputChannel.appendLine(stderr);
		});

		// Display a message box to the user
		vscode.window.showInformationMessage(currentFilePath);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
