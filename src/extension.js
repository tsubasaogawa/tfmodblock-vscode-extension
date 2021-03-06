const vscode = require('vscode');
const tfmodblock = require('./tfmodblock');
const logger = require('./logger');
const version = require('./version');
const config = vscode.workspace.getConfiguration('tfmodblock');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const binaryVersion = version.getBinaryVersion(config);
	logger.output(`Current binary ver: ${binaryVersion}`);
	if (!version.isCompatible(binaryVersion)) {
		vscode.window.showErrorMessage(`tfmodblock requires ${version.getMinimumVersion()} at least (yours = ${binaryVersion})`);
		return;
	}

	[
		vscode.commands.registerCommand('tfmodblock.copyModuleBlockSnippet', tfmodblock.copyModuleBlockSnippet.bind(null, config)),
		vscode.commands.registerCommand('tfmodblock.insertModuleBlockSnippet', tfmodblock.insertModuleBlockSnippet.bind(null, config)),
	].forEach(disposable => {
		context.subscriptions.push(disposable);
	});
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
