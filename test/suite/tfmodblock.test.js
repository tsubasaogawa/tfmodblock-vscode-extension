const assert = require('assert');
const vscode = require('vscode');
const tfmodblock = require('../../src/tfmodblock');

suite('Extension Test: tfmodblock', () => {
	vscode.window.showInformationMessage('Start tfmodblock tests.');
	const config = vscode.workspace.getConfiguration('tfmodblock');

	test('insertModuleBlockSnippet throws no editor error', () => {
		assert.throws(() => { tfmodblock.insertModuleBlockSnippet(config); }, {
			name: 'Error',
			message: 'Editor is null'
		})
	});

});
