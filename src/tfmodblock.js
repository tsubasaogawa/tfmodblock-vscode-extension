const vscode = require('vscode');
const path = require('path');
const child_process = require('child_process');
const logger = require('./logger');
const version = require('./version');

module.exports = {
    insertModuleBlockSnippet,
}

/**
 * 
 * @returns string
 */
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
 * @param {vscode.TextEditor} editor 
 * @param {vscode.Position} position 
 * @returns string
 */
async function getModulePath(editor, position) {
    const line = editor.document.lineAt(position.line);

    const sourceMatch = line.text.match(/^\s*source\s*=\s*["]?(?<path>[^"]+)["]?\s*$/);
    if (sourceMatch == null) {
        return await selectModuleDirectory();
    }
    const sourceRelPath = sourceMatch.groups.path;
    const currentPath = path.dirname(editor.document.fileName);
    return path.resolve(`${currentPath}/${sourceRelPath}`);
}

/**
 * 
 * @param {vscode.TextLine} line 
 * @returns number
 */
function getIndentSpaceCount(line) {
    const match = line.text.match(/^(?<indent>\s*)/);
    if (match == null) {
        return 0;
    }
    return match.groups.indent.length;
}

/**
 * 
 * @param {string} currentVer
 * @returns void
 */
async function insertModuleBlockSnippet(currentVer) {
    const config = vscode.workspace.getConfiguration('tfmodblock');
    let editor = vscode.window.activeTextEditor;
    if (editor == null) {
        throw new Error('Editor is null');
    }

    const position = editor.selection.active;
    const modulePath = await getModulePath(editor, position);
    if (!modulePath) {
        return;
    }
    const canSort = config.sort && version.isCompatible(currentVer, version.sortableVersion);
    const canUseDefault = config.useDefault && version.isCompatible(currentVer, version.useDefaultVersion);
    const canUseDescription = config.useDescription && version.isCompatible(currentVer, version.useDescriptionVersion);
    const indentSpaceCnt = getIndentSpaceCount(editor.document.lineAt(position.line));
    const options = `--sort=${canSort} --default=${canUseDefault} --description=${canUseDescription} --tabsize=${indentSpaceCnt} --vscode`
    console.log(`${config.useDefault}`);

    child_process.exec(`'${config.binPath}' ${options} '${modulePath}'`, (error, stdout, stderr) => {
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
