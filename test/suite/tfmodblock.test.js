const assert = require('assert');
const vscode = require('vscode');
const tfmodblock = require('../../src/tfmodblock');

suite('Extension Test: tfmodblock', () => {
	vscode.window.showInformationMessage('Start tfmodblock tests.');
	const config = vscode.workspace.getConfiguration('tfmodblock');

	test('copyModuleBlockSnippet throws no tf file error', () => {
		assert.throws(() => { tfmodblock.copyModuleBlockSnippet(config); }, {
			name: 'Error',
			message: 'Editor is null'
		})
	});
});
