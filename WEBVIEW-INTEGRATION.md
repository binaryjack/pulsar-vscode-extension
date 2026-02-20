# Webview Panel Integration - Complete

## Overview

Phase 4B is now complete: Interactive webview panel with rich trace visualization.

## Components

### 1. TracerWebviewProvider (`src/tracer/webview-panel.ts`)

- **Purpose**: Webview UI provider for trace event visualization
- **Key Features**:
  - Real-time event streaming
  - Interactive filtering (channel + type)
  - Live statistics (total events, avg duration, channel count)
  - Color-coded event display per channel
  - Recording indicator animation
  - CSV/JSON export to file system

### 2. Updated TracerServer (`src/tracer/tracer-server.ts`)

- **Changes**: Dual-stream events to Output Channel + Webview
- **Integration Points**:
  - `setWebviewProvider()` - Connect webview to server
  - `startTracerServer()` - Start webview recording
  - HTTP request handler - Send events to both UI surfaces
  - `stopTracerServer()` - Stop webview recording
  - `clearTraceOutput()` - Clear both Output Channel and Webview

### 3. Extension Activation (`src/extension.ts`)

- **Registration**: `vscode.window.registerWebviewViewProvider()`
- **Connection**: `setWebviewProvider(tracerProvider)`
- **Lifecycle**: Provider instantiated on activation, registered once

### 4. Package Manifest (`package.json`)

- **Views Container**: "Pulsar Tracer" activity bar icon (pulse)
- **View**: "Trace Events" webview in sidebar
- **Commands**: All 5 tracer commands work with both UIs

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Pulsar Transformer (pulsar-transformer package)       │
│  - init-tracing.ts instruments 12 methods              │
│  - HTTP Target sends events to localhost:9339          │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP POST /trace
                       ▼
┌─────────────────────────────────────────────────────────┐
│  VS Code Extension (pulsar-vscode-extension)            │
│                                                           │
│  ┌────────────────────────────────────────────────┐    │
│  │  tracer-server.ts (HTTP Server)                │    │
│  │  - Receives batched events on port 9339        │    │
│  │  - Dual-stream to:                              │    │
│  │    1. Output Channel (formatted text)          │    │
│  │    2. Webview Panel (structured JSON)          │    │
│  └────────────────┬───────────────────┬───────────┘    │
│                   │                    │                 │
│                   ▼                    ▼                 │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │  Output Channel      │  │  Webview Panel       │   │
│  │  - Text stream       │  │  - Interactive UI    │   │
│  │  - Timestamped       │  │  - Filters           │   │
│  │  - Scrollable        │  │  - Statistics        │   │
│  └──────────────────────┘  │  - Export            │   │
│                             │  - Color-coded       │   │
│                             └──────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Event Flow

1. **Transformer**: `PULSAR_TRACE_HTTP=http://localhost:9339/trace` set
2. **HTTP Target**: Batches 10 events, POSTs to server
3. **TracerServer**: Receives POST, parses JSON
4. **Dual Stream**:
   - **Output Channel**: Formats timestamp + event data as text
   - **Webview**: Sends structured event via `postMessage()`
5. **Webview UI**: Renders event, updates stats, applies filters

## User Interface

### Activity Bar Icon

- Location: Left sidebar activity bar
- Icon: Pulse symbol ($(pulse))
- Title: "Pulsar Tracer"

### Webview Panel

- **Toolbar**: Start/Stop/Clear/Export buttons
- **Stats Panel**: Total Events | Avg Duration | Channels
- **Filters**:
  - Channel buttons (Lexer, Parser, Semantic, Transformer, Codegen, System)
  - Type buttons (Start, End, Error, Iteration, Snapshot)
- **Event List**: Scrollable, color-coded by channel
- **Recording Indicator**: Animated pulse when active

### Color Coding

- **Lexer**: Blue
- **Parser**: Green
- **Semantic**: Yellow
- **Transformer**: Purple
- **Codegen**: Red
- **System**: Cyan

## Usage

### 1. Open Tracer View

- Click "Pulsar Tracer" icon in activity bar
- Or use Command Palette: "Pulsar: Start Tracer"

### 2. Start Recording

- Click "Start" in webview toolbar
- Or use Command: "Pulsar: Start Tracer"
- Server starts on port 9339
- Webview recording indicator pulses

### 3. Run Transformation

```powershell
$env:PULSAR_TRACE = "1"
$env:PULSAR_TRACE_HTTP = "http://localhost:9339/trace"
$env:PULSAR_TRACE_CHANNELS = "lexer,parser,transformer"

node test-your-transformation.js
```

### 4. View Events

- **Output Channel**: Text stream with timestamps
- **Webview**: Interactive UI with filters and stats

### 5. Filter Events

- Click channel buttons to toggle visibility
- Click type buttons to toggle event types
- Multiple filters can be combined

### 6. Export Events

- Click "Export" button
- Choose format: JSON or CSV
- Save to file system

## Implementation Details

### Message Protocol

Webview uses VS Code message API:

```typescript
// Extension → Webview
webview.postMessage({
  command: 'addEvent',
  event: { timestamp, channel, type, name, duration, ... }
});

webview.postMessage({
  command: 'addEvents',
  events: [...]
});

// Webview → Extension
vscode.postMessage({
  command: 'export',
  format: 'json' | 'csv'
});
```

### State Management

- **Extension**: Maintains webview provider reference
- **Webview**: Maintains events array, filter states, recording flag
- **Sync**: Events pushed from extension, UI updates reactively

### Performance

- Webview runs in isolated context (no DOM access to VS Code)
- Events appended to HTML (no full re-render)
- Filter operations in-memory on event array
- Statistics calculated incrementally

## Testing

### End-to-End Test

1. Build extension: `pnpm run build`
2. Press F5 to launch Extension Development Host
3. Open Pulsar Tracer view in sidebar
4. Run Command: "Pulsar: Start Tracer"
5. In terminal, run transformer with env vars
6. Verify events appear in both Output Channel and Webview
7. Test filters: Toggle channel buttons, verify event visibility
8. Test export: Click Export → JSON, save file, verify contents
9. Test clear: Click Clear, verify events removed from both UIs
10. Run Command: "Pulsar: Stop Tracer", verify recording stops

### Expected Results

- Events stream to both UIs in real-time
- Webview stats update (Total Events, Avg Duration, Channels)
- Channel filters toggle event visibility
- Type filters toggle event visibility
- Export produces valid JSON/CSV files
- Clear removes events from both UIs
- Recording indicator animates during active tracing

## Known Limitations

### Phase 4B (Current)

- Webview panel cannot persist state across VS Code restarts
- No event detail drill-down (click event for full data)
- No performance graphs (planned for future)
- No search functionality within events

### Future Enhancements (Phase 4C+)

- Tree View for hierarchical call stacks
- Event detail modal on click
- Performance graphs (duration over time)
- Search/filter by event name
- Persistent filter preferences
- Export current filtered view
- Event timeline visualization

## Technical Constraints

### Webview Limitations

- Separate JavaScript context (no direct DOM access)
- Message-based communication only
- Limited to VS Code Webview API
- No access to Node.js modules

### Performance Targets

- Handle 1000+ events without lag
- Filter operations <100ms
- Export operations <500ms
- UI updates <16ms (60fps)

## File Structure

```
pulsar-vscode-extension/
├── src/
│   ├── extension.ts                 # Registers webview provider
│   └── tracer/
│       ├── tracer-server.ts         # HTTP server + dual-stream
│       ├── webview-panel.ts         # Webview UI provider
│       └── tracer-types.ts          # Shared TypeScript interfaces
├── package.json                     # Views + viewsContainers
├── TRACER.md                        # User guide (Output Channel)
└── WEBVIEW-INTEGRATION.md           # This file (Webview details)
```

## Configuration

No additional configuration required. Webview panel uses existing tracer commands and environment variables.

## Troubleshooting

### Webview Not Loading

- Check Extension Development Host console for errors
- Verify webview provider registration in extension.ts
- Confirm views configuration in package.json

### Events Not Appearing

- Verify tracer server started: "Pulsar: Show Tracer Status"
- Check PULSAR_TRACE_HTTP env var set correctly
- Confirm HTTP POST requests reaching port 9339
- Inspect Output Channel for server logs

### Filters Not Working

- Open DevTools: Help → Toggle Developer Tools
- Check Webview Console for JavaScript errors
- Verify postMessage() calls succeed

### Export Fails

- Check file system permissions
- Verify VS Code workspace has write access
- Inspect extension host logs for error details

## Next Steps

✅ **Phase 4B Complete**: Webview panel with interactive UI
⏳ **Phase 4C**: Tree View for hierarchical call stacks
⏳ **Phase 5**: Production hardening (benchmarks, stress tests)

---

**Last Updated**: 2025-02-11  
**Status**: Implementation Complete - Testing Pending
