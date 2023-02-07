const vscode = require('vscode');
const path = require('path');
const child_process = require('child_process');
const logger = require('./logger');

module.exports = {
    insertModuleBlockSnippet,
}


    }
}

/**
 * 
 * @param {vscode.WorkspaceConfiguration} config 
 * @returns void
 */
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
