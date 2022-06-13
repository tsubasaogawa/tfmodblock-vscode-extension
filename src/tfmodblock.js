const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const logger = require('./logger');

module.exports = {
    copyModuleBlockSnippet,
    insertModuleBlockSnippet,
}

/**
 * 
 * @param {vscode.WorkspaceConfiguration} config 
 * @returns void
 */
function copyModuleBlockSnippet(config) {
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
        logger.output(stderr);
    });

    // Display a message box to the user
    vscode.window.showInformationMessage("tfmodblock: copied");
}

/**
 * 
 * @param {vscode.WorkspaceConfiguration} config 
 * @returns void
 */
function insertModuleBlockSnippet(config) {
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
        logger.output(moduleSnippet);
        editor.edit((edit => {
            edit.insert(new vscode.Position(position.line + 1, 0), moduleSnippet);
        }));
        logger.output(stderr);
    });

}