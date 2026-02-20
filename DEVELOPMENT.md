# Pulsar VS Code Extension

This extension provides comprehensive language support for Pulsar (`.psr`) files.

## Features

- **Syntax Highlighting**: TSX-like syntax with multi-level DOM element differentiation
- **Code Snippets**: Quick snippets for common Pulsar patterns
- **File Icons**: Custom icon for `.psr` files
- **IntelliSense**: Basic autocomplete support

## Development

### Build

```bash
pnpm install
pnpm run build
```

### Package

```bash
pnpm run package
```

This creates a `.vsix` file that can be installed in VS Code.

### Install Locally

```bash
code --install-extension pulsar-vscode-0.1.0.vsix
```

### Publish

```bash
pnpm run publish
```

## Syntax Highlighting

The extension provides multi-level color differentiation for JSX elements:

- **Level 0**: Cyan/Teal (#4EC9B0) - Root elements
- **Level 1**: Blue (#569CD6) - Direct children
- **Level 2**: Purple (#C586C0) - Nested elements
- **Level 3+**: Yellow (#DCDCAA) - Deeply nested

Component names (PascalCase) are **bold** for easy identification.

## File Structure

```
pulsar-vscode-extension/
├── src/
│   └── extension.ts           # Main extension code
├── syntaxes/
│   └── psr.tmLanguage.json    # TextMate grammar
├── snippets/
│   └── psr.json               # Code snippets
├── icons/
│   └── pulsar-icon.svg        # File icon (placeholder)
├── language-configuration.json # Language config
├── package.json               # Extension manifest
├── tsconfig.json              # TypeScript config
└── README.md                  # Documentation
```

## License

MIT
