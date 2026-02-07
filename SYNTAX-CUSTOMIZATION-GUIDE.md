# PSR Syntax Highlighting Customization Guide

**Updated:** February 6, 2026  
**Version:** 0.3.0

---

## 🎨 Overview

The Pulsar VSCode extension provides comprehensive syntax highlighting with support for:

- ✅ **Nested tag color levels** (5 levels of indentation)
- ✅ **Attribute names** (distinct from tag names)
- ✅ **Attribute values** (strings highlighted separately)
- ✅ **Plain text content** (normal text between tags)
- ✅ **Embedded expressions** (`{...}` syntax)

---

## 🔍 Scope Reference

### JSX/PSR Scopes

| Element | Scope Name | Default Theme Color |
|---------|------------|---------------------|
| **Tag Level 1** | `entity.name.tag.jsx.level-1` | Teal/Cyan |
| **Tag Level 2** | `entity.name.tag.jsx.level-2` | Blue |
| **Tag Level 3** | `entity.name.tag.jsx.level-3` | Purple |
| **Tag Level 4** | `entity.name.tag.jsx.level-4` | Yellow |
| **Tag Level 5** | `entity.name.tag.jsx.level-5` | Orange |
| **Attribute Name** | `entity.other.attribute-name.jsx` | Light Blue |
| **Attribute Value (string)** | `string.quoted.double.jsx` | Orange/Brown |
| **Attribute Value (single quote)** | `string.quoted.single.jsx` | Orange/Brown |
| **Text Content** | `meta.jsx.text.jsx` | Default text color |
| **Embedded Expression** | `meta.embedded.expression.jsx` | Context-dependent |
| **Tag Punctuation** | `punctuation.definition.tag.*` | Dimmed |

### PSR-Specific Scopes

| Element | Scope Name | Default Theme Color |
|---------|------------|---------------------|
| **`component` keyword** | `keyword.control.component.psr` | Purple |
| **Component name** | `entity.name.function.component.psr` | Yellow |
| **Signal functions** | `support.function.signal.psr` | Light Blue |

---

## 🎨 Customization Examples

### Example 1: Rainbow Nested Tags

Add this to your `settings.json` to give each nesting level a distinct color:

```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "entity.name.tag.jsx.level-1",
        "settings": {
          "foreground": "#4EC9B0",
          "fontStyle": "bold"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-2",
        "settings": {
          "foreground": "#569CD6"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-3",
        "settings": {
          "foreground": "#C586C0"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-4",
        "settings": {
          "foreground": "#DCDCAA"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-5",
        "settings": {
          "foreground": "#CE9178"
        }
      }
    ]
  }
}
```

### Example 2: Subtle Nesting (Opacity-Based)

Use progressively lighter colors for deeper nesting:

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
          "foreground": "#4EC9B0CC"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-3",
        "settings": {
          "foreground": "#4EC9B099"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-4",
        "settings": {
          "foreground": "#4EC9B066"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-5",
        "settings": {
          "foreground": "#4EC9B033"
        }
      }
    ]
  }
}
```

### Example 3: High Contrast Attributes

Make attributes stand out more:

```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "entity.other.attribute-name.jsx",
        "settings": {
          "foreground": "#9CDCFE",
          "fontStyle": "italic"
        }
      },
      {
        "scope": "string.quoted.double.jsx, string.quoted.single.jsx",
        "settings": {
          "foreground": "#CE9178",
          "fontStyle": ""
        }
      }
    ]
  }
}
```

### Example 4: Monochrome with Underlines

Use font styles instead of colors:

```json
{
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "entity.name.tag.jsx.level-1",
        "settings": {
          "fontStyle": "bold underline"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-2",
        "settings": {
          "fontStyle": "bold"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-3",
        "settings": {
          "fontStyle": "italic"
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-4",
        "settings": {
          "fontStyle": ""
        }
      },
      {
        "scope": "entity.name.tag.jsx.level-5",
        "settings": {
          "fontStyle": ""
        }
      }
    ]
  }
}
```

---

## 🌈 Theme-Specific Customization

Apply different colors per theme:

```json
{
  "editor.tokenColorCustomizations": {
    "[Dark+ (default dark)]": {
      "textMateRules": [
        {
          "scope": "entity.name.tag.jsx.level-1",
          "settings": {
            "foreground": "#4EC9B0"
          }
        }
      ]
    },
    "[Light+ (default light)]": {
      "textMateRules": [
        {
          "scope": "entity.name.tag.jsx.level-1",
          "settings": {
            "foreground": "#0070C1"
          }
        }
      ]
    }
  }
}
```

---

## 🧪 Testing Your Customization

### 1. Use the Scope Inspector

1. Open a `.psr` file
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type: **"Developer: Inspect Editor Tokens and Scopes"**
4. Click on any element to see its scope
5. Verify the scope name matches your customization

### 2. Test File

Create a file `test-syntax.psr` with this content:

```psr
component TestSyntax() {
  return (
    <div className="level-1" title="Test">
      <h1>Hello Level 1</h1>
      <section>
        <h2>Hello Level 2</h2>
        <article>
          <h3>Hello Level 3</h3>
          <aside>
            <h4>Hello Level 4</h4>
            <footer>
              <p>Hello Level 5</p>
            </footer>
          </aside>
        </article>
      </section>
    </div>
  );
}
```

**Expected results:**
- `div` → Level 1 color
- `h1`, `section` → Level 2 color
- `h2`, `article` → Level 3 color
- `h3`, `aside` → Level 4 color
- `h4`, `footer` → Level 5 color
- `p` → Level 5 color (max depth)
- `className`, `title` → Attribute color (light blue)
- `"level-1"`, `"Test"` → String color (orange)
- `Hello Level 1`, `Hello Level 2`, etc. → Default text color

---

## 🎯 Common Customization Scenarios

### Scenario 1: "I want all tags the same color"

Remove or don't add any level-specific rules. The default theme will handle it.

### Scenario 2: "I want attributes more visible"

```json
{
  "scope": "entity.other.attribute-name.jsx",
  "settings": {
    "foreground": "#FFFF00",
    "fontStyle": "bold"
  }
}
```

### Scenario 3: "I want text content to stand out"

```json
{
  "scope": "meta.jsx.text.jsx",
  "settings": {
    "foreground": "#FFFFFF",
    "fontStyle": ""
  }
}
```

### Scenario 4: "I want string values dimmed"

```json
{
  "scope": "string.quoted.double.jsx, string.quoted.single.jsx",
  "settings": {
    "foreground": "#808080"
  }
}
```

---

## 🔧 Troubleshooting

### Issue: "My colors aren't changing"

**Solutions:**
1. Reload VSCode: `Ctrl+Shift+P` → "Reload Window"
2. Check JSON syntax in `settings.json`
3. Verify scope names with Inspector tool
4. Ensure you're editing the correct `settings.json`

### Issue: "Text content still looks like tags"

**Solution:**
This should be fixed in version 0.3.0+. Update the extension.

### Issue: "Attribute values look like tags"

**Solution:**
This should be fixed in version 0.3.0+. Update the extension.

### Issue: "All nesting levels look the same"

**Expected behavior:**
By default, themes don't distinguish nesting levels. You must add custom rules (see examples above).

---

## 📚 Advanced: Creating a Custom Theme

For more permanent customization, create your own color theme:

1. **Create Theme Extension:**
   ```bash
   yo code
   # Select "New Color Theme"
   ```

2. **Add PSR-specific scopes:**
   ```json
   {
     "tokenColors": [
       {
         "scope": "entity.name.tag.jsx.level-1",
         "settings": {
           "foreground": "#4EC9B0"
         }
       }
       // ... more rules
     ]
   }
   ```

3. **Publish to Marketplace:**
   ```bash
   vsce package
   vsce publish
   ```

---

## 🎨 Recommended Color Palettes

### Palette 1: Oceanic

```json
{
  "level-1": "#4EC9B0",  // Teal
  "level-2": "#569CD6",  // Blue
  "level-3": "#9CDCFE",  // Light Blue
  "level-4": "#B5CEA8",  // Green
  "level-5": "#C586C0"   // Purple
}
```

### Palette 2: Sunset

```json
{
  "level-1": "#CE9178",  // Orange
  "level-2": "#D7BA7D",  // Gold
  "level-3": "#DCDCAA",  // Yellow
  "level-4": "#B5CEA8",  // Green
  "level-5": "#4EC9B0"   // Teal
}
```

### Palette 3: Monochrome

```json
{
  "level-1": "#FFFFFF",  // White
  "level-2": "#D4D4D4",  // Light Gray
  "level-3": "#9D9D9D",  // Medium Gray
  "level-4": "#6A6A6A",  // Dark Gray
  "level-5": "#505050"   // Darker Gray
}
```

---

## 📖 Related Documentation

- [NESTING-COLORS.md](./NESTING-COLORS.md) - Original nesting colors documentation
- [README.md](./README.md) - Extension overview
- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - Testing procedures

---

## 🤝 Contributing

Have a great color scheme? Share it!

1. Fork the repository
2. Add your scheme to this document
3. Submit a Pull Request

---

**Last Updated:** February 6, 2026  
**Extension Version:** 0.3.0+
