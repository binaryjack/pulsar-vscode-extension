# Testing the Nested Tag Colors Feature

## What Was Fixed

### 1. **Bug Fix: Closing Tag Highlighting**

- **Before:** Closing tags like `</div>` had different colors from opening tags `<div>`
- **After:** Opening and closing tags now have matching colors
- **Technical:** The closing tag pattern now properly captures the tag name with the correct scope

### 2. **New Feature: Nested Tag Color Levels**

- JSX tags are now assigned different scopes based on nesting depth (up to 5 levels)
- Each level can be colored differently for better visual nesting

## How to Test

### Method 1: Install the New Extension

1. **Uninstall the old version:**

   ```powershell
   code --uninstall-extension binaryjack.pulsar-vscode
   ```

2. **Install the new version:**

   ```powershell
   cd e:\Sources\visual-schema-builder\packages\pulsar-vscode-extension
   code --install-extension pulsar-vscode-0.2.0.vsix
   ```

3. **Reload VSCode:**
   - Press `Ctrl+Shift+P`
   - Type "Reload Window" and press Enter

### Method 2: Test in Extension Development Host

1. **Open the extension project:**

   ```powershell
   code e:\Sources\visual-schema-builder\packages\pulsar-vscode-extension
   ```

2. **Press `F5`** to open Extension Development Host with the extension loaded

3. **Open a `.psr` file** in the development host window

### Test File

Create a test file `test-nesting.psr` with nested JSX:

```jsx
component TestNesting() {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>Level 5</li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
```

### Verify the Fixes

#### 1. Check Opening/Closing Tag Colors Match

- Open and closing tags should now have the same color
- Example: `<div>` and `</div>` should be the same color

#### 2. Configure Custom Colors for Nesting Levels

Add to your VSCode `settings.json`:

```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "entity.name.tag.jsx.level-1",
        "settings": {
          "foreground": "#4EC9B0"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-2",
        "settings": {
          "foreground": "#45B5A0"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-3",
        "settings": {
          "foreground": "#3CA190"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-4",
        "settings": {
          "foreground": "#338D80"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-5",
        "settings": {
          "foreground": "#2A7970"
        }
      }
    ]
  }
}
```

#### 3. Use TextMate Scope Inspector

1. **Open Command Palette:** `Ctrl+Shift+P`
2. **Type:** "Developer: Inspect Editor Tokens and Scopes"
3. **Click on any JSX tag** to see its scope
4. **Verify scopes:**
   - Level 1: `entity.name.tag.jsx.level-1`
   - Level 2: `entity.name.tag.jsx.level-2`
   - Level 3: `entity.name.tag.jsx.level-3`
   - Level 4: `entity.name.tag.jsx.level-4`
   - Level 5: `entity.name.tag.jsx.level-5`

## Changes Summary

### Files Modified

- `syntaxes/psr.tmLanguage.json` - Complete rewrite of JSX syntax patterns
- `README.md` - Added nested tag colors feature description
- `CHANGELOG.md` - Documented v0.2.0 changes
- `package.json` - Bumped version to 0.2.0

### Files Created

- `NESTING-COLORS.md` - Comprehensive customization guide
- `TESTING-GUIDE.md` - This file

### Package Generated

- `pulsar-vscode-0.2.0.vsix` - Ready to install

## For More Information

See [NESTING-COLORS.md](./NESTING-COLORS.md) for:

- Detailed customization examples
- Color scheme suggestions
- Theme-specific configuration
- Visual examples

## Known Limitations

- Nesting depth is limited to 5 levels (after level 5, all tags use level-5 scope)
- Self-closing tags like `<Component />` are treated as the same level
- Requires manual color configuration in settings.json (not automatic)

## Next Steps

1. Test the extension thoroughly
2. Update VSIX version if needed
3. Publish to VSCode marketplace
4. Update documentation with screenshots
