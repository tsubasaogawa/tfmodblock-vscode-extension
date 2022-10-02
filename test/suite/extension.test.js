const assert = require('assert');
const vscode = require('vscode');
const version = require('../../src/version');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

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

	test('getBinaryVersion returns some version string', () => {
		const config = vscode.workspace.getConfiguration('tfmodblock');
		assert.match(version.getBinaryVersion(config), /^\d+\.\d+\.\d+$/);
	});

	test('getMimimumVersion returns some version string', () => {
		assert.match(version.getMinimumVersion(), /^\d+\.\d+\.\d+$/);
	});
});
