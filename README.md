# PSR Language Support for Visual Studio Code

**Pulsar Source (PSR)** syntax highlighting and file icons for Visual Studio Code.

## Features

✨ **Enhanced Syntax Highlighting** _(v0.3.0+)_
- `component` keyword highlighting
- Signal functions (`signal`, `createSignal`, `createEffect`, `createMemo`)
- JSX/TSX syntax support with proper scoping
- TypeScript integration
- Template literals with syntax injection
- **✨ NEW: Attribute values properly highlighted** (strings distinct from tags)
- **✨ NEW: Plain text content** (text between tags no longer looks like tags)
- **✨ NEW: Better attribute name highlighting**

🎨 **Custom File Icons**
- Distinctive PSR file icon in Explorer
- Light/Dark theme support
- Purple gradient theme matching Pulsar brand

🔧 **Language Features**
- Auto-closing brackets and tags
- Code folding
- Comment toggling
- Smart indentation
- JSX auto-closing
- **Nested tag color levels** - Different colors for each nesting depth (up to 5 levels)

> 💡 **Customization:** See [SYNTAX-CUSTOMIZATION-GUIDE.md](./SYNTAX-CUSTOMIZATION-GUIDE.md) for detailed color customization examples.  
> 📖 **Nesting Colors:** See [NESTING-COLORS.md](./NESTING-COLORS.md) for nested tag configuration.

## What's New in v0.3.0

### 🎯 Major Improvements

1. **Attribute Values Fixed**
   - String values in attributes now have proper syntax highlighting
   - Example: `<button className="primary">` → `"primary"` is now properly colored as a string

2. **Text Content Fixed**
   - Plain text between JSX tags no longer looks like tag names
   - Example: `<div>Hello World</div>` → `Hello World` appears as normal text

3. **Better Attribute Highlighting**
   - Attribute names are now distinct from tag names and values
   - Example: `className` has its own color scheme

### 🎨 Syntax Highlighting Comparison

**Before (v0.2.0):**
```
<div className="container">     ← Everything looks similar
  <h1>Welcome</h1>              ← Text looks like tags
</div>
```

**After (v0.3.0):**
```
<div className="container">     ← Tags, attributes, and strings all distinct
  <h1>Welcome</h1>              ← Text properly highlighted as content
</div>
```

---

## Supported File Extensions

- `.psr` - Pulsar Source files

## Syntax Highlighting Examples

### Component Declaration
```psr
component Counter() {
  const [count, setCount] = signal(0);
  
  return (
    <button onClick={() => setCount(count() + 1)}>
      Count: {count()}
    </button>
  );
}
```

### Signal Usage
```psr
component App() {
  const [name, setName] = signal('');
  const [email, setEmail] = signal('');
  
  const isValid = createMemo(() => {
    return name().length > 0 && email().includes('@');
  });
  
  createEffect(() => {
    console.log('Form validity:', isValid());
  });
  
  return <div>...</div>;
}
```

## Installation

### From VSIX
1. Download the `.vsix` file
2. Open VSCode
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Type "Extensions: Install from VSIX"
5. Select the downloaded `.vsix` file

### From Marketplace (Coming Soon)
Search for "PSR Language Support" in the Extensions marketplace.

## Building from Source

```bash
cd packages/vscode-psr-extension
pnpm install
pnpm run package
```

This creates a `.vsix` file you can install.

## Language Server (Planned)

Future versions will include:
- IntelliSense for PSR components
- Go to definition
- Find all references
- Rename refactoring
- Type checking integration
- Auto-imports

## Contributing

Contributions welcome! This extension is part of the Pulsar Framework project.

## License

MIT

---

**Pulsar Framework** - Fine-grained reactive UI framework  
[Documentation](https://pulsar.dev) | [GitHub](https://github.com/binaryjack/visual-schema-builder)
