const assert = require('assert');
const vscode = require('vscode');
const logger = require('../../src/logger');

suite('Extension Test: logger', () => {
	vscode.window.showInformationMessage('Start logger tests.');

	test('output returns a message with iso date', () => {
		assert.match(logger.output('foo'), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z foo$/);
	});
});
