/**
 * Pulsar VSCode Extension
 * Entry point for the extension
 */

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Pulsar VSCode extension is now active!');

  // Register commands, language features, etc. here
  // TODO: Add language server client when ready
}

export function deactivate() {
  console.log('Pulsar VSCode extension deactivated');
}
