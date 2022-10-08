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
 * @param {string} dir 
 * @returns 
 */
function existsTfFile(dir) {
    let existsTfFile = false;
    const currentDirFiles = fs.readdirSync(dir);

    for (const file of currentDirFiles) {
        if (file.endsWith('.tf')) {
            existsTfFile = true;
            break;
        }
    }
    return existsTfFile;
}

/**
 * 
 * @param {vscode.WorkspaceConfiguration} config 
 * @returns void
 */
function copyModuleBlockSnippet(config) {
    let editor = vscode.window.activeTextEditor;
    if (editor == null) {
        throw new Error('Editor is null');
    }

    const currentFilePath = editor.document.fileName;
    const currentDir = path.dirname(currentFilePath);
    if (!existsTfFile(currentDir)) {
        throw new Error('There is no *.tf file');
    }

    // run tfmodblock
    child_process.exec(`${config.binPath} ${currentDir}`, async (error, stdout, stderr) => {
        await vscode.env.clipboard.writeText(stdout);
        if (stderr !== '') {
            logger.output(stderr);
        } else {
            vscode.window.showInformationMessage("tfmodblock: copied");
        }
    });
}

/**
 * 
 * @param {vscode.WorkspaceConfiguration} config 
 * @returns void
 */
function insertModuleBlockSnippet(config) {
    let editor = vscode.window.activeTextEditor;
    if (editor == null) {
        throw new Error('Editor is null');
    }
    // get module block from active cursor
    const position = editor.selection.active;
    const line = editor.document.lineAt(position.line);

    const sourceMatch = line.text.match(/^\s*source\s*=\s*["]?(?<path>[^"]+)["]?\s*$/);
    if (sourceMatch == null) {
        vscode.window.showErrorMessage('tfmodblock: cannot parse source text');
        return;
    }
    const sourceRelPath = sourceMatch.groups.path;
    const currentPath = path.dirname(editor.document.fileName);
    const pathToModule = path.resolve(`${currentPath}/${sourceRelPath}`);

    child_process.exec(`${config.binPath} --vscode ${pathToModule}`, (error, stdout, stderr) => {
        const moduleSnippet = stdout.replace(/^\r?\n/g, '');
        logger.output(`output: ${moduleSnippet}`);
        editor.edit((edit => {
            edit.insert(new vscode.Position(position.line + 1, 0), moduleSnippet);
        }));
        if (stderr !== '') {
            logger.output(stderr);
        }
    });
}
