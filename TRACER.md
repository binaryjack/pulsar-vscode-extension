# Pulsar Tracer Integration

**Real-time transformer tracing in VS Code**

## 🚀 Features

- **Live event streaming** - See lexer/parser/transformer events in real-time
- **Zero intrusion** - Enable/disable without code changes
- **Performance metrics** - Track function execution times
- **Channel filtering** - Focus on lexer, parser, or specific components
- **Output Channel UI** - Native VS Code integration

---

## 📋 Quick Start

### 1. Start Tracer in VS Code

Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

```
> Pulsar: Start Tracer
```

This starts an HTTP server on `localhost:9339` listening for trace events.

### 2. Enable Tracing in Your Project

**Option A: Environment Variables (Vite)**

Edit your `.env` or `.env.local`:

```bash
PULSAR_TRACE=1
PULSAR_TRACE_CHANNELS=lexer,parser
PULSAR_TRACE_HTTP=http://localhost:9339/trace
```

**Option B: Vite Config**

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    'process.env.PULSAR_TRACE': '"1"',
    'process.env.PULSAR_TRACE_CHANNELS': '"lexer,parser"',
    'process.env.PULSAR_TRACE_HTTP': '"http://localhost:9339/trace"',
  },
});
```

**Option C: Node.js Script**

```javascript
process.env.PULSAR_TRACE = '1';
process.env.PULSAR_TRACE_CHANNELS = 'lexer,parser';
process.env.PULSAR_TRACE_HTTP = 'http://localhost:9339/trace';

import { transform } from '@pulsar-framework/transformer';
// ... your code
```

### 3. Save a .psr File or Run Build

When Vite transforms your `.psr` files, events stream to VS Code:

```
🚀 Pulsar Tracer Started
📡 Listening on http://localhost:9339

[14:23:45] [LEXER     ] function.start    scanTokens
[14:23:45] [LEXER     ] function.start    scanToken
[14:23:45] [LEXER     ] function.start    scanIdentifier
[14:23:45] [LEXER     ] function.end      scanIdentifier (0.32ms)
[14:23:45] [LEXER     ] function.end      scanToken (0.45ms)
[14:23:45] [PARSER    ] function.start    parse
[14:23:45] [PARSER    ] function.start    parseExpression
[14:23:45] [PARSER    ] function.end      parseExpression (1.23ms)
[14:23:45] [PARSER    ] function.end      parse (5.67ms)
```

---

## 📖 Commands

All commands available via Command Palette:

| Command                      | Description                                  |
| ---------------------------- | -------------------------------------------- |
| `Pulsar: Start Tracer`       | Start HTTP server and display Output Channel |
| `Pulsar: Stop Tracer`        | Stop HTTP server                             |
| `Pulsar: Clear Trace Output` | Clear Output Channel                         |
| `Pulsar: Show Tracer Status` | Check if tracer is running                   |
| `Pulsar: Export Traces`      | Export to file (coming soon)                 |

---

## ⚙️ Configuration

### Environment Variables

| Variable                | Description       | Default | Example                       |
| ----------------------- | ----------------- | ------- | ----------------------------- |
| `PULSAR_TRACE`          | Enable tracing    | `0`     | `1`                           |
| `PULSAR_TRACE_CHANNELS` | Filter by channel | all     | `lexer,parser`                |
| `PULSAR_TRACE_HTTP`     | HTTP target URL   | none    | `http://localhost:9339/trace` |
| `PULSAR_TRACE_WINDOW`   | Buffer size       | `1000`  | `5000`                        |

### Available Channels

- `lexer` - Token scanning operations
- `parser` - AST parsing operations
- `semantic` - Semantic analysis (future)
- `transformer` - AST transformations (future)
- `codegen` - Code generation (future)
- `system` - System events (errors, snapshots)

---

## 🎯 Use Cases

### Debug Parsing Issues

```bash
PULSAR_TRACE=1
PULSAR_TRACE_CHANNELS=parser
PULSAR_TRACE_HTTP=http://localhost:9339/trace
```

Save your problematic `.psr` file → see exact parse operations in VS Code.

### Performance Profiling

```bash
PULSAR_TRACE=1
PULSAR_TRACE_HTTP=http://localhost:9339/trace
```

Look for `function.end` events with high duration values:

```
[PARSER] function.end parseExpression (245.67ms)  ← SLOW!
```

### Development Workflow

1. `Pulsar: Start Tracer` once per session
2. Edit `.psr` files
3. Vite hot-reload triggers transformation
4. Events appear in Output Channel
5. Debug issues in real-time

---

## 🔧 Troubleshooting

### "Port 9339 is already in use"

Another tracer instance is running:

```
> Pulsar: Stop Tracer
```

Or change port in your config:

```bash
PULSAR_TRACE_HTTP=http://localhost:9340/trace
```

### No Events Appearing

1. **Check tracer is running:** `> Pulsar: Show Tracer Status`
2. **Check environment:** Ensure `PULSAR_TRACE=1` is set
3. **Check URL:** Must be `http://localhost:9339/trace` (include `/trace`)
4. **Restart Vite:** Changes to `.env` require Vite restart

### Events But No Output

Check Output Channel is visible:

- View → Output
- Select "Pulsar Tracer" from dropdown

---

## 🚧 Roadmap

### Phase 4A: Output Channel ✅ **CURRENT**

- [x] HTTP server in extension
- [x] Real-time event streaming
- [x] Commands (start/stop/clear)
- [ ] Better formatting
- [ ] Color coding by channel
- [ ] Filter UI

### Phase 4B: Webview Panel (Next)

- [ ] Rich HTML/React UI
- [ ] Interactive filtering
- [ ] Collapsible call stacks
- [ ] Performance timeline graph
- [ ] Export to JSON/CSV

### Phase 4C: Tree View (Future)

- [ ] Sidebar integration
- [ ] Hierarchical event display
- [ ] Click to jump to code

---

## 📝 Example: Full Setup

**`.env.local`:**

```bash
PULSAR_TRACE=1
PULSAR_TRACE_CHANNELS=lexer,parser
PULSAR_TRACE_HTTP=http://localhost:9339/trace
```

**VS Code:**

1. Install Pulsar extension
2. Open Command Palette
3. `> Pulsar: Start Tracer`
4. View → Output → "Pulsar Tracer"

**Terminal:**

```bash
pnpm run dev  # Start Vite
# Edit .psr files → See traces in VS Code!
```

---

## 🤝 Contributing

Found a bug? Have an idea?

1. Open issue: https://github.com/binaryjack/pulsar-vscode-extension
2. Submit PR: Follow contribution guidelines
3. Discuss: Join community discussions

---

**Built with ❤️ for the Pulsar Framework**
