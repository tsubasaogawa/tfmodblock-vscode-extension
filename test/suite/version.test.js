const assert = require('assert');
const vscode = require('vscode');
const version = require('../../src/version');

suite('Extension Test: version', () => {
	vscode.window.showInformationMessage('Start version tests.');

	test('isCompatible returns true', () => {
		assert.strictEqual(version.isCompatible('0.0.10'), true);
		assert.strictEqual(version.isCompatible('0.0.4'), true);
		assert.strictEqual(version.isCompatible('999.99.99'), true);
	});

	test('isCompatible returns false', () => {
		assert.strictEqual(version.isCompatible('0.0.1'), false);
	});

	test('isCompatible throws Error', () => {
		assert.throws(() => { version.isCompatible('foobar'); }, Error);
		assert.throws(() => { version.isCompatible(null); }, Error);
	});
});
