# Change Log

All notable changes to the "psr-language-support" extension will be documented in this file.

## [0.3.0] - 2026-02-06

### 🎉 Major Improvements

#### Fixed: Attribute String Values  
**Problem:** String values in JSX attributes looked like tag names.  
**Solution:** Added proper string scopes (`string.quoted.double.jsx`, `string.quoted.single.jsx`) to attribute patterns.

**Example:**
```psr
<button className="primary" title="Click me">
```
- Before: `"primary"` and `"Click me"` had tag-like highlighting ❌
- After: Strings properly highlighted with distinct color (orange/brown) ✅

#### Fixed: Text Content Between Tags  
**Problem:** Plain text between JSX tags was highlighted like tag names.  
**Solution:** Added explicit text content pattern (`meta.jsx.text.jsx`) to all JSX children patterns.

**Example:**
```psr
<div>Hello World</div>
<h1>Welcome to Pulsar</h1>
```
- Before: `Hello World` and `Welcome to Pulsar` looked like tags ❌
- After: Text appears as normal content (default text color) ✅

#### Better Attribute Name Highlighting  
Attribute names now have consistent highlighting separate from tags and values.

**Example:**
```psr
<input type="text" placeholder="Enter name" required />
```
- `input` → Tag color (teal/cyan)
- `type`, `placeholder`, `required` → Attribute color (light blue)
- `"text"`, `"Enter name"` → String color (orange/brown)

### Added
- `meta.jsx.text.jsx` scope for plain text content
- `string.quoted.double.jsx` scope for double-quoted attribute values
- `string.quoted.single.jsx` scope for single-quoted attribute values
- `constant.character.escape.jsx` scope for escape sequences in strings
- Comprehensive **SYNTAX-CUSTOMIZATION-GUIDE.md** with examples
- Analysis document **VSCODE-SYNTAX-HIGHLIGHTING-IMPROVEMENTS.md** in docs/pulsar

### Improved
- All JSX children patterns now properly distinguish text from markup
- Better scope consistency with official TypeScript-TmLanguage patterns
- Improved out-of-box experience (less looks-the-same highlighting)

### Documentation
- Added `SYNTAX-CUSTOMIZATION-GUIDE.md` - Comprehensive color customization guide
- Added `docs/pulsar/VSCODE-SYNTAX-HIGHLIGHTING-IMPROVEMENTS.md` - Technical analysis
- Updated `README.md` with v0.3.0 improvements
- Updated `NESTING-COLORS.md` references

### Technical Details
Based on research from official Microsoft TypeScript-TmLanguage repository patterns:
- Proper string handling in JSX attributes (matching TSX behavior)
- Text content scoping (matching TSX behavior)
- Escape sequence support in string literals

---

## [0.2.0] - 2026-02-06

### Added
- **Nested Tag Color Levels**: Different syntax scopes for each JSX tag nesting level (up to 5 levels deep)
- Customizable colors per nesting depth - see `NESTING-COLORS.md` for configuration guide
- Example color schemes for subtle tonality differences

### Fixed
- **Closing Tag Highlighting**: Opening and closing tags now have matching colors (previously closing tags were colored as punctuation)
- Tag name properly captured and highlighted in closing tags (`</div>` now highlights `div` correctly)

### Documentation
- Added `NESTING-COLORS.md` with complete customization guide and examples
- Updated README with nested tag color feature information

## [0.1.0] - 2026-02-04

### Added
- Initial release
- Syntax highlighting for PSR files
- `component` keyword support
- Signal function highlighting (`signal`, `createSignal`, `createEffect`, `createMemo`)
- JSX syntax support
- Custom file icons for `.psr` files
- Light/Dark theme icon variants
- Auto-closing brackets and JSX tags
- Code folding support
- Comment toggling
- Smart indentation

### Highlights
- **Component Declaration**: Special highlighting for `component MyComponent()`
- **Reactive Functions**: Signal-related functions are visually distinct
- **JSX Support**: Full JSX/TSX syntax highlighting
- **Custom Icons**: Purple gradient PSR icon in file explorer

## [Unreleased]

### Planned
- Language Server Protocol (LSP) integration
- IntelliSense for PSR components
- Type checking
- Go to definition
- Find all references
- Rename refactoring
- Code snippets for common patterns
- Live error checking
- Auto-import suggestions
