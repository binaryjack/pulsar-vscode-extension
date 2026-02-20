# Installation Guide - Pulsar VS Code Extension

## Quick Installation

### Option 1: Install from VSIX (Recommended for local development)

1. **Build the extension:**

```powershell
cd packages\pulsar-vscode-extension
pnpm install
pnpm run build
pnpm run package
```

2. **Install in VS Code:**

```powershell
code --install-extension pulsar-vscode-0.1.0.vsix
```

Or in VS Code:
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "Extensions: Install from VSIX"
- Select the `pulsar-vscode-0.1.0.vsix` file

3. **Reload VS Code** to activate the extension

### Option 2: Development Mode

For testing during development:

1. Open the extension folder in VS Code:
```powershell
code packages\pulsar-vscode-extension
```

2. Press `F5` to launch Extension Development Host

3. Open a `.psr` file to see the syntax highlighting

## Verification

After installation:

1. Open any `.psr` file in your workspace
2. Check the language mode in the bottom-right corner - it should show "Pulsar"
3. Verify syntax highlighting is working with colors:
   - **Root elements**: Cyan/Teal
   - **Nested level 1**: Blue
   - **Nested level 2**: Purple
   - **Nested level 3+**: Yellow
   - **Components**: Bold Cyan
   - **Attributes**: Italic Light Blue

## Features

### Syntax Highlighting

The extension provides TSX-like syntax highlighting with:
- Multi-level DOM element differentiation (4 levels with distinct colors)
- Bold highlighting for React components (PascalCase)
- Italic styling for attributes
- Template string support
- Embedded expression highlighting

### Code Snippets

Type the following prefixes and press `Tab`:

- `psr-component` - Create a basic component
- `psr-component-props` - Create a component with props
- `psr-signal` - Create a signal
- `psr-computed` - Create a computed value
- `psr-effect` - Create an effect
- `psr-onmount` - OnMount lifecycle hook
- `psr-oncleanup` - OnCleanup lifecycle hook
- `psr-fragment` - JSX fragment
- `psr-map` - Map array to elements

### Language Configuration

- Auto-closing tags
- Auto-closing brackets and quotes
- Comment toggling with `Ctrl+/`
- Bracket matching and colorization

## Customization

You can customize the syntax colors in your VS Code settings:

```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "entity.name.tag.jsx.psr",
        "settings": {
          "foreground": "#YOUR_COLOR"
        }
      }
    ]
  }
}
```

## Troubleshooting

### Extension not activating

1. Check if the extension is installed:
   - Go to Extensions view (`Ctrl+Shift+X`)
   - Search for "Pulsar"

2. Reload VS Code window:
   - Press `Ctrl+Shift+P`
   - Type "Developer: Reload Window"

### Syntax highlighting not working

1. Verify the file extension is `.psr`
2. Check the language mode (bottom-right corner)
3. If showing "Plain Text", click it and select "Pulsar"
4. Reload the window if needed

### Colors not showing

1. Verify workspace settings are loaded (`.vscode/settings.json`)
2. Check if semantic highlighting is enabled
3. Try a different color theme and reload

## Uninstallation

```powershell
code --uninstall-extension binaryjack.pulsar-vscode
```

Or through VS Code:
- Go to Extensions view
- Find "Pulsar Language Support"
- Click the gear icon → Uninstall

## Next Steps

- Check out the [README](./README.md) for feature details
- See [DEVELOPMENT.md](./DEVELOPMENT.md) for contributing
- Report issues on [GitHub](https://github.com/binaryjack/visual-schema-builder/issues)
