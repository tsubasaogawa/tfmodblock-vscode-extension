const assert = require('assert');
const vscode = require('vscode');
const version = require('../../src/version');

suite('Extension Test: version', () => {
	vscode.window.showInformationMessage('Start version tests.');

	test('isCompatible returns true', () => {
		assert.strictEqual(version.isCompatible('999.99.99'), true);
	});

	test('isCompatible returns false', () => {
		assert.strictEqual(version.isCompatible('0.0.1'), false);
	});

	test('isCompatible throws Error', () => {
		assert.throws(() => { version.isCompatible('foobar'); }, Error);
		assert.throws(() => { version.isCompatible(null); }, Error);
	});

	/* TODO: fix error 
	test('getBinaryVersion calls a command with `-v` option', async () => {
		let config = vscode.workspace.getConfiguration('tfmodblock');
		await config.update('binPath', 'echo', true);
		assert.match(version.getBinaryVersion(config), /^-v$/);
	});
	*/
	test('getMimimumVersion returns some version string', () => {
		assert.match(version.getMinimumVersion(), /^\d+\.\d+\.\d+$/);
	});
});
