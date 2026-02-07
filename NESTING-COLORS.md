# PSR Nested Tag Color Customization

The PSR syntax highlighting now supports different colors for nested JSX tags based on their depth level (up to 5 levels deep).

## How It Works

- **Level 1** (outermost): `entity.name.tag.jsx.level-1`
- **Level 2**: `entity.name.tag.jsx.level-2`
- **Level 3**: `entity.name.tag.jsx.level-3`
- **Level 4**: `entity.name.tag.jsx.level-4`
- **Level 5** (innermost): `entity.name.tag.jsx.level-5`

## Customizing Colors

Add the following to your VSCode `settings.json` to customize the colors for each nesting level:

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

## Example with Subtle Tonality Differences

For a more subtle effect with gradually darker/lighter shades:

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

## Visual Example

```jsx
<div>              <!-- Level 1: #4EC9B0 -->
  <header>         <!-- Level 2: #45B5A0 -->
    <nav>          <!-- Level 3: #3CA190 -->
      <ul>         <!-- Level 4: #338D80 -->
        <li>       <!-- Level 5: #2A7970 -->
          Content
        </li>      <!-- Level 5: #2A7970 -->
      </ul>        <!-- Level 4: #338D80 -->
    </nav>         <!-- Level 3: #3CA190 -->
  </header>        <!-- Level 2: #45B5A0 -->
</div>             <!-- Level 1: #4EC9B0 -->
```

## Theme-Specific Customization

You can also apply these rules to specific themes:

```json
{
  "editor.tokenColorCustomizations": {
    "[Dark+ (default dark)]": {
      "textMateRules": [
        // Your color rules here
      ]
    },
    "[Light+ (default light)]": {
      "textMateRules": [
        // Different color rules for light theme
      ]
    }
  }
}
```

## Notes

- Opening and closing tags now have matching colors (bug fixed)
- After level 5, nesting continues with the same level-5 color
- Colors are inherited by punctuation (`<`, `>`, `</`, `/>`)
- Applies to all JSX/HTML-like syntax in `.psr` files
