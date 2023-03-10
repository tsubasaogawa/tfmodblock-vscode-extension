const assert = require('assert');
const vscode = require('vscode');
const tfmodblock = require('../../src/tfmodblock');

suite('Extension Test: tfmodblock', () => {
	vscode.window.showInformationMessage('Start tfmodblock tests.');

	test('insertModuleBlockSnippet throws no editor error', () => {
		assert.throws(() => { tfmodblock.insertModuleBlockSnippet('0.0.0'); }, {
			name: 'Error',
			message: 'Editor is null'
		})
	});

});
