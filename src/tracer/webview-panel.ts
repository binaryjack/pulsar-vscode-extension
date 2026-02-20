/**
 * Webview Panel for Pulsar Tracer
 * Rich interactive UI with filtering, search, and performance metrics
 */

import { Buffer } from 'node:buffer';
import * as vscode from 'vscode';
import type { TraceEvent } from './tracer-types';

export class TracerWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'pulsar.tracerView';

  private _view?: vscode.WebviewView;
  private _events: TraceEvent[] = [];
  private _isRecording: boolean = false;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlContent(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case 'clear':
          this.clearEvents();
          break;
        case 'export':
          this.exportEvents();
          break;
        case 'filter':
          this.filterEvents(data.channels, data.types);
          break;
      }
    });
  }

  public addEvent(event: TraceEvent) {
    if (!this._isRecording) return;

    this._events.push(event);

    // Keep last 1000 events in webview
    if (this._events.length > 1000) {
      this._events.shift();
    }

    this._view?.webview.postMessage({
      type: 'event',
      event: event,
    });
  }

  public addEvents(events: TraceEvent[]) {
    if (!this._isRecording) return;

    this._events.push(...events);

    // Trim to last 1000
    if (this._events.length > 1000) {
      this._events = this._events.slice(-1000);
    }

    this._view?.webview.postMessage({
      type: 'events',
      events: events,
    });
  }

  public startRecording() {
    this._isRecording = true;
    this._view?.webview.postMessage({ type: 'recording', value: true });
  }

  public stopRecording() {
    this._isRecording = false;
    this._view?.webview.postMessage({ type: 'recording', value: false });
  }

  public clearEvents() {
    this._events = [];
    this._view?.webview.postMessage({ type: 'clear' });
  }

  public async exportEvents() {
    const uri = await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.file(`pulsar-trace-${Date.now()}.json`),
      filters: {
        JSON: ['json'],
        CSV: ['csv'],
      },
    });

    if (!uri) return;

    const content = uri.fsPath.endsWith('.csv')
      ? this._eventsToCSV()
      : JSON.stringify(this._events, null, 2);

    await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
    vscode.window.showInformationMessage(`Exported ${this._events.length} events to ${uri.fsPath}`);
  }

  private filterEvents(channels: string[], types: string[]) {
    this._view?.webview.postMessage({
      type: 'filtered',
      events: this._events.filter(
        (e) =>
          (channels.length === 0 || channels.includes(e.channel)) &&
          (types.length === 0 || types.includes(e.type))
      ),
    });
  }

  private _eventsToCSV(): string {
    const header = 'timestamp,channel,type,name,duration,error\n';
    const rows = this._events.map((e) => {
      const ts = new Date(e.timestamp).toISOString();
      const duration = 'duration' in e ? e.duration : '';
      const error = 'error' in e ? (e.error as Error).message : '';
      const name = 'name' in e ? e.name : '';
      return `${ts},${e.channel},${e.type},${name},${duration},${error}`;
    });
    return header + rows.join('\n');
  }

  private _getHtmlContent(webview: vscode.Webview): string {
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'tracer.css')
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pulsar Tracer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      padding: 10px;
    }

    .toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
      padding: 8px;
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
    }

    .toolbar button {
      padding: 4px 12px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    }

    .toolbar button:hover {
      background: var(--vscode-button-hoverBackground);
    }

    .stats {
      display: flex;
      gap: 16px;
      margin-bottom: 10px;
      padding: 8px;
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      font-size: 11px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-label {
      opacity: 0.7;
      font-size: 10px;
    }

    .stat-value {
      font-weight: 600;
      font-size: 14px;
    }

    .filters {
      margin-bottom: 10px;
      padding: 8px;
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
    }

    .filter-group {
      margin-bottom: 8px;
    }

    .filter-label {
      font-size: 11px;
      opacity: 0.8;
      margin-bottom: 4px;
    }

    .filter-buttons {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .filter-button {
      padding: 2px 8px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border);
      border-radius: 3px;
      cursor: pointer;
      font-size: 10px;
    }

    .filter-button.active {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border-color: var(--vscode-button-background);
    }

    .events {
      height: calc(100vh - 250px);
      overflow-y: auto;
      font-family: var(--vscode-editor-font-family);
      font-size: 11px;
      line-height: 1.4;
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      padding: 4px;
    }

    .event {
      padding: 2px 4px;
      border-bottom: 1px solid var(--vscode-panel-border);
      font-family: 'Consolas', 'Courier New', monospace;
      white-space: pre;
    }

    .event:hover {
      background: var(--vscode-list-hoverBackground);
    }

    .event.lexer { border-left: 3px solid #61afef; }
    .event.parser { border-left: 3px solid #98c379; }
    .event.semantic { border-left: 3px solid #e5c07b; }
    .event.transformer { border-left: 3px solid #c678dd; }
    .event.codegen { border-left: 3px solid #e06c75; }
    .event.system { border-left: 3px solid #56b6c2; }

    .recording-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #e06c75;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      opacity: 0.6;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button onclick="sendMessage('clear')">Clear</button>
    <button onclick="sendMessage('export')">Export</button>
    <div style="flex: 1"></div>
    <div class="recording-indicator" id="recordingIndicator" style="display: none;"></div>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-label">Total Events</div>
      <div class="stat-value" id="totalEvents">0</div>
    </div>
    <div class="stat">
      <div class="stat-label">Avg Duration</div>
      <div class="stat-value" id="avgDuration">0ms</div>
    </div>
    <div class="stat">
      <div class="stat-label">Channels</div>
      <div class="stat-value" id="channelCount">0</div>
    </div>
  </div>

  <div class="filters">
    <div class="filter-group">
      <div class="filter-label">Channels:</div>
      <div class="filter-buttons" id="channelFilters"></div>
    </div>
    <div class="filter-group">
      <div class="filter-label">Event Types:</div>
      <div class="filter-buttons" id="typeFilters"></div>
    </div>
  </div>

  <div class="events" id="events">
    <div class="empty-state">
      <p>No events yet. Start the tracer to see events.</p>
      <p style="font-size: 10px; margin-top: 8px;">Run: <code>Pulsar: Start Tracer</code></p>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    let allEvents = [];
    let activeChannels = [];
    let activeTypes = [];

    window.addEventListener('message', event => {
      const message = event.data;
      
      switch (message.type) {
        case 'event':
          addEvent(message.event);
          break;
        case 'events':
          addEvents(message.events);
          break;
        case 'clear':
          clearEvents();
          break;
        case 'recording':
          document.getElementById('recordingIndicator').style.display = 
            message.value ? 'block' : 'none';
          break;
        case 'filtered':
          displayEvents(message.events);
          break;
      }
    });

    function sendMessage(type, data = {}) {
      vscode.postMessage({ type, ...data });
    }

    function addEvent(event) {
      allEvents.push(event);
      if (allEvents.length > 1000) allEvents.shift();
      
      updateFilters();
      updateStats();
      appendEventToDOM(event);
    }

    function addEvents(events) {
      allEvents.push(...events);
      if (allEvents.length > 1000) allEvents = allEvents.slice(-1000);
      
      updateFilters();
      updateStats();
      displayEvents(allEvents);
    }

    function clearEvents() {
      allEvents = [];
      document.getElementById('events').innerHTML = 
        '<div class="empty-state"><p>Cleared. Waiting for events...</p></div>';
      updateStats();
    }

    function appendEventToDOM(event) {
      const container = document.getElementById('events');
      if (container.querySelector('.empty-state')) {
        container.innerHTML = '';
      }

      const div = document.createElement('div');
      div.className = \`event \${event.channel}\`;
      
      const time = new Date(event.timestamp).toLocaleTimeString();
      const channel = event.channel.toUpperCase().padEnd(10);
      const type = event.type.padEnd(18);
      const name = event.name || '';
      const duration = event.duration ? \` (\${event.duration.toFixed(2)}ms)\` : '';
      
      div.textContent = \`[\${time}] [\${channel}] \${type} \${name}\${duration}\`;
      
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function displayEvents(events) {
      const container = document.getElementById('events');
      container.innerHTML = '';
      events.forEach(e => appendEventToDOM(e));
    }

    function updateStats() {
      document.getElementById('totalEvents').textContent = allEvents.length;
      
      const durations = allEvents
        .filter(e => e.duration)
        .map(e => e.duration);
      const avgDuration = durations.length > 0
        ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2)
        : 0;
      document.getElementById('avgDuration').textContent = \`\${avgDuration}ms\`;
      
      const channels = new Set(allEvents.map(e => e.channel));
      document.getElementById('channelCount').textContent = channels.size;
    }

    function updateFilters() {
      const channels = [...new Set(allEvents.map(e => e.channel))];
      const types = [...new Set(allEvents.map(e => e.type))];
      
      const channelContainer = document.getElementById('channelFilters');
      channelContainer.innerHTML = channels.map(ch => 
        \`<button class="filter-button \${activeChannels.includes(ch) ? 'active' : ''}" 
          onclick="toggleChannel('\${ch}')">\${ch}</button>\`
      ).join('');
      
      const typeContainer = document.getElementById('typeFilters');
      typeContainer.innerHTML = types.map(t => 
        \`<button class="filter-button \${activeTypes.includes(t) ? 'active' : ''}" 
          onclick="toggleType('\${t}')">\${t}</button>\`
      ).join('');
    }

    function toggleChannel(channel) {
      if (activeChannels.includes(channel)) {
        activeChannels = activeChannels.filter(c => c !== channel);
      } else {
        activeChannels.push(channel);
      }
      applyFilters();
    }

    function toggleType(type) {
      if (activeTypes.includes(type)) {
        activeTypes = activeTypes.filter(t => t !== type);
      } else {
        activeTypes.push(type);
      }
      applyFilters();
    }

    function applyFilters() {
      updateFilters();
      sendMessage('filter', { channels: activeChannels, types: activeTypes });
    }
  </script>
</body>
</html>`;
  }
}
