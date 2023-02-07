const vscode = require('vscode');
const path = require('path');
const child_process = require('child_process');
const logger = require('./logger');

module.exports = {
    insertModuleBlockSnippet,
}

async function selectModuleDirectory() {
    const dir = await vscode.window.showOpenDialog({
        title: 'Choose module directory',
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
    });

    if (!dir || dir.length != 1) {
        return '';
    }
    return dir[0].path;
}

/**
 * 
 * @param {vscode.WorkspaceConfiguration} config 
 * @returns void
 */
async function insertModuleBlockSnippet(config) {
    let editor = vscode.window.activeTextEditor;
    if (editor == null) {
        throw new Error('Editor is null');
    }
    // get module block from active cursor
    const position = editor.selection.active;
    const line = editor.document.lineAt(position.line);

    const sourceMatch = line.text.match(/^\s*source\s*=\s*["]?(?<path>[^"]+)["]?\s*$/);
    let pathToModule;
    if (sourceMatch != null) {
        const sourceRelPath = sourceMatch.groups.path;
        const currentPath = path.dirname(editor.document.fileName);
        pathToModule = path.resolve(`${currentPath}/${sourceRelPath}`);
    } else {
        pathToModule = await selectModuleDirectory();
        // TODO: add `source` line
        if (!pathToModule) {
            return;
        }
    }
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
