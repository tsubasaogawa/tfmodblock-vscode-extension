// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const child_process = require('child_process');
const fs = require('fs');
const { format } = require('path');
const config = vscode.workspace.getConfiguration('tfmodblock');

let outputChannel = vscode.window.createOutputChannel('tfmodblock');
let appendToOutput = function (msg) {
	outputChannel.appendLine(`${msg}`);
}

const binaryMinimumVersion = '0.0.4';

function isCompatible(currentVer) {
	let m = {
		minimum: binaryMinimumVersion.match(/(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/),
		current: `${currentVer}`.match(/(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/),
	};
	if (m.minimum == null || m.current == null) {
		vscode.window.showErrorMessage(`cannot parse version / minimum: ${m.minimum}, current: ${m.current}`);
		return;
	}
	new Map([
		['major', [m.minimum.groups.major, m.current.groups.minor]],
		['minor', [m.minimum.groups.minor, m.current.groups.minor]],
		['patch', [m.minimum.groups.patch, m.current.groups.patch]]
	]).forEach(function (_, v) {
		if (v[0] < v[1]) {
			return true;
		}
		else if (v[0] > v[1]) {
			return false;
		}
	});
	return true;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposables = [];
	disposables.push(vscode.commands.registerCommand('tfmodblock.copyModuleBlockSnippet', function () {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		if (editor == null) {
			throw new Error();
		}
		const currentFilePath = editor.document.fileName;
		const currentDir = path.dirname(currentFilePath);
		try {
			let existsTfFile = false;
			const currentDirFiles = fs.readdirSync(currentDir);
			for (const file of currentDirFiles) {
				if (file.endsWith('.tf')) {
					existsTfFile = true;
					break;
				}
			}
			if (!existsTfFile) {
				throw new Error('There is no *.tf file');
			}
		} catch (e) {
			vscode.window.showErrorMessage(e);
			return;
		}

		// run tfmodblock
		child_process.exec(`${config.binPath} ${currentDir}`, async (error, stdout, stderr) => {
			// outputChannel.appendLine(stdout);
			await vscode.env.clipboard.writeText(stdout);
			appendToOutput(stderr);
		});

		// Display a message box to the user
		vscode.window.showInformationMessage("tfmodblock: copied");
	}));

	disposables.push(vscode.commands.registerCommand('tfmodblock.insertModuleBlockSnippet', function () {
		let editor = vscode.window.activeTextEditor;
		if (editor == null) {
			throw new Error();
		}
		// get module block from active cursor
		const position = editor.selection.active;
		const line = editor.document.lineAt(position.line);

		const sourceMatch = line.text.match(/^\s*source\s*=\s*["]?(?<path>[^"]+)["]?\s*$/)
		if (sourceMatch == null) {
			return;
		}
		const sourceRelPath = sourceMatch.groups.path;
		const currentPath = path.dirname(editor.document.fileName);
		const pathToModule = path.resolve(`${currentPath}/${sourceRelPath}`);

		child_process.exec(`${config.binPath} --vscode ${pathToModule}`, (error, stdout, stderr) => {
			const moduleSnippet = stdout;
			appendToOutput(moduleSnippet);
			editor.edit((edit => {
				edit.insert(new vscode.Position(position.line + 1, 0), moduleSnippet);
			}));
			appendToOutput(stderr);
		});
	}));

	disposables.forEach(disposable => {
		context.subscriptions.push(disposable);
	});

	let binaryVersion = child_process.execSync(`${config.binPath} -v`);
	appendToOutput(`Get ver: ${binaryVersion}`);
	if (!isCompatible(binaryVersion)) {
		vscode.window.showErrorMessage(`tfmodblock requires ${binaryMinimumVersion} at least (yours = ${binaryVersion})`);
		return;
	}
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
