"use strict";
/**
 * Pulsar VSCode Extension
 * Entry point for the extension
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
function activate(context) {
    console.log('Pulsar VSCode extension is now active!');
    // Register commands, language features, etc. here
    // TODO: Add language server client when ready
}
function deactivate() {
    console.log('Pulsar VSCode extension deactivated');
}
//# sourceMappingURL=extension.js.map