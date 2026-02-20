# Testing Webview Integration - Quick Guide

## Prerequisites

✅ All files updated:

- `src/tracer/webview-panel.ts` - Created
- `src/tracer/tracer-types.ts` - Created
- `src/tracer/tracer-server.ts` - Updated with dual-stream
- `src/extension.ts` - Registers webview provider
- `package.json` - Views container + view definition

## Build & Launch

### 1. Build Extension

```powershell
cd packages/pulsar-vscode-extension
pnpm run build
```

### 2. Launch Extension Development Host

Press **F5** in VS Code, or:

1. Open Debug panel (Ctrl+Shift+D)
2. Select "Run Extension" from dropdown
3. Click green play button

A new VS Code window ("Extension Development Host") will open.

## Test Steps

### Test 1: Verify Webview Panel Appears

**In Extension Development Host:**

1. Look for "Pulsar Tracer" icon in left sidebar activity bar (pulse icon)
2. Click the icon
3. Verify "Trace Events" panel appears with:
   - Toolbar (Start, Stop, Clear, Export buttons)
   - Empty event list
   - Status: "No events recorded yet"

**Expected**: Webview panel loads with UI visible.

---

### Test 2: Start Tracer

**In Extension Development Host:**

1. Open Command Palette (Ctrl+Shift+P)
2. Run: "Pulsar: Start Tracer"
3. Verify notification: "Pulsar Tracer started on port 9339"
4. Verify webview "Recording indicator" shows pulsing dot

**Expected**: Server starts, webview enters recording mode.

---

### Test 3: Send Test Events

**In your main VS Code window** (not Extension Host), open terminal:

```powershell
cd packages/pulsar-transformer

# Set environment variables
$env:PULSAR_TRACE = "1"
$env:PULSAR_TRACE_HTTP = "http://localhost:9339/trace"
$env:PULSAR_TRACE_CHANNELS = "lexer,parser,transformer"

# Run transformation test
node ../test-http-client.js
```

**In Extension Development Host, check:**

1. **Output Channel**:
   - View → Output
   - Select "Pulsar Tracer" from dropdown
   - Verify timestamped events appear

2. **Webview Panel**:
   - Check "Trace Events" panel
   - Verify events appear in list
   - Verify stats update:
     - Total Events (should be ~68)
     - Avg Duration (should show ms)
     - Channels (should show 3: Lexer, Parser, Transformer)

**Expected**: Events stream to both Output Channel and Webview in real-time.

---

### Test 4: Filter by Channel

**In Extension Development Host webview:**

1. Click "Lexer" button in Filters section
2. Verify only blue-bordered events visible
3. Click "Parser" button
4. Verify blue + green events visible
5. Click "Lexer" again to toggle off
6. Verify only green events visible

**Expected**: Filter buttons toggle channel visibility correctly.

---

### Test 5: Filter by Type

**In Extension Development Host webview:**

1. Click "Show All Channels" to reset
2. Click "Start" type filter button
3. Verify only function.start events visible
4. Click "End" type filter button
5. Verify function.start + function.end events visible

**Expected**: Type filters work independently from channel filters.

---

### Test 6: Export Events

**In Extension Development Host webview:**

1. Click "Export" button
2. Click "JSON" in prompt
3. Choose save location
4. Verify file created with `.json` extension
5. Open file, verify valid JSON array of events

**Repeat with CSV:**

1. Click "Export" button
2. Click "CSV" in prompt
3. Choose save location
4. Verify file created with `.csv` extension
5. Open file, verify CSV format with headers

**Expected**: Export produces valid JSON/CSV files with event data.

---

### Test 7: Clear Events

**In Extension Development Host:**

1. Verify events visible in webview
2. Click "Clear" button
3. Verify events disappear from webview
4. Verify webview shows "No events recorded yet"
5. Check Output Channel
6. Verify "🧹 Trace output cleared" message appears

**Expected**: Clear removes events from both UI surfaces.

---

### Test 8: Stop Tracer

**In Extension Development Host:**

1. Open Command Palette (Ctrl+Shift+P)
2. Run: "Pulsar: Stop Tracer"
3. Verify notification: "Pulsar Tracer stopped"
4. Verify webview recording indicator stops pulsing
5. Run test again from main window
6. Verify NO new events appear in webview

**Expected**: Tracer stops, no new events received.

---

### Test 9: Interactive Stats

**In Extension Development Host webview:**

1. Start tracer
2. Run transformation with 21 tokens
3. Watch stats panel update in real-time:
   - Total Events should climb to ~68
   - Avg Duration should stabilize around 0.5-2ms
   - Channels should show 3

**Expected**: Stats calculate correctly and update live.

---

### Test 10: Color Coding

**In Extension Development Host webview:**

Verify color-coded event borders:

- **Lexer** events: Blue left border
- **Parser** events: Green left border
- **Transformer** events: Purple left border

**Expected**: Visual distinction by channel color.

---

## Troubleshooting

### Webview Not Loading

**Check:**

1. Extension Development Host console (Help → Toggle Developer Tools)
2. Look for JavaScript errors
3. Verify files compiled: `ls dist/` should show all .js files

**Fix:**

```powershell
cd packages/pulsar-vscode-extension
rm -r dist
pnpm run build
```

### Events Not Appearing

**Check:**

1. Tracer status: Run "Pulsar: Show Tracer Status"
2. Environment variables set correctly in terminal
3. HTTP target reachable: `curl http://localhost:9339` (should respond)

**Fix:**

- Restart tracer: Stop → Start
- Check port not in use: `netstat -ano | findstr :9339`

### TypeScript Errors

**Check:**

```powershell
cd packages/pulsar-vscode-extension
pnpm run build
```

**Common Issues:**

- Missing import: Add to extension.ts
- Type mismatch: Check tracer-types.ts interface

### Webview JavaScript Errors

**Check:**

1. Open Extension Development Host DevTools
2. Check Console tab for errors
3. Look for postMessage() failures

**Debug:**

- Add `console.log()` in webview-panel.ts HTML `<script>` section
- Check message protocol matches

## Verification Checklist

✅ Webview panel appears in sidebar  
✅ Start tracer via command  
✅ Events appear in Output Channel  
✅ Events appear in webview panel  
✅ Stats update correctly (Total, Avg, Channels)  
✅ Channel filters toggle visibility  
✅ Type filters toggle visibility  
✅ Export to JSON produces valid file  
✅ Export to CSV produces valid file  
✅ Clear removes events from both UIs  
✅ Stop tracer stops event streaming  
✅ Recording indicator animates correctly  
✅ Color coding per channel works

## Expected Performance

- **Event Display Latency**: <100ms from HTTP POST to UI
- **Filter Operations**: <50ms for 1000 events
- **Export Operations**: <500ms for 1000 events
- **UI Responsiveness**: 60fps (no lag during event streaming)

## Known Limitations

### Current (Phase 4B)

- No event detail drill-down (click for full data)
- No performance graphs
- No search within events
- State lost on VS Code restart

### Future Enhancements

- Event detail modal on click
- Performance timeline graphs
- Search/filter by name
- Persistent state across restarts
- Tree view for call hierarchies

## Next Steps After Testing

If all tests pass:

1. **Document behavior**: Add screenshots to TRACER.md
2. **User guide**: Update TRACER.md with webview usage
3. **Phase 4C**: Implement Tree View for call stacks
4. **Phase 5**: Benchmarks and stress testing

If tests fail:

1. Check Extension Development Host console
2. Verify all files compiled (check dist/)
3. Inspect webview DevTools console
4. Review tracer-server.ts message protocol
5. Confirm HTTP server running on port 9339

---

**Last Updated**: 2025-02-11  
**Status**: Ready for Testing
