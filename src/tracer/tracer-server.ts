/**
 * VS Code Extension for Pulsar Tracer
 * Displays real-time trace events from transformer
 */

import type http from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createServer } from 'node:http';
import * as vscode from 'vscode';
import type { TracerWebviewProvider } from './webview-panel';

let traceServer: http.Server | null = null;
let traceChannel: vscode.OutputChannel | null = null;
let webviewProvider: TracerWebviewProvider | null = null;
let isTracing = false;

const TRACE_PORT = 9339;

/**
 * Set webview provider for event streaming
 */
export function setWebviewProvider(provider: TracerWebviewProvider): void {
  webviewProvider = provider;
}

/**
 * Start tracer HTTP server
 */
function startTracerServer(context: vscode.ExtensionContext): void {
  if (traceServer) {
    vscode.window.showWarningMessage('Pulsar tracer is already running');
    return;
  }

  // Create output channel
  if (!traceChannel) {
    traceChannel = vscode.window.createOutputChannel('Pulsar Tracer');
    context.subscriptions.push(traceChannel);
  }

  traceChannel.clear();
  traceChannel.show();
  traceChannel.appendLine('🚀 Pulsar Tracer Started');
  traceChannel.appendLine(`📡 Listening on http://localhost:${TRACE_PORT}`);
  traceChannel.appendLine('');

  // Create HTTP server
  traceServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'POST') {
      let body = '';

      req.on('data', (chunk: unknown) => {
        body += String(chunk);
      });

      req.on('end', () => {
        try {
          const { events } = JSON.parse(body);

          // Send to webview if active
          if (webviewProvider) {
            webviewProvider.addEvents(events);
          }

          // Display events in Output Channel
          for (const event of events) {
            const timestamp = new Date(event.timestamp).toLocaleTimeString();
            const channel = event.channel.toUpperCase().padEnd(10);
            const type = event.type.padEnd(18);
            const name = event.name || '';

            let line = `[${timestamp}] [${channel}] ${type}`;

            if (name) {
              line += ` ${name}`;
            }

            // Add duration for end events
            if (event.duration !== undefined) {
              line += ` (${event.duration.toFixed(2)}ms)`;
            }

            traceChannel?.appendLine(line);
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } catch (error) {
          console.error('Tracer parse error:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else if (req.method === 'GET') {
      // Status page for browser verification
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>Pulsar Tracer</title></head>
        <body style="font-family: monospace; padding: 20px;">
          <h1>✅ Pulsar Tracer Server Running</h1>
          <p>Status: <strong style="color: green;">ACTIVE</strong></p>
          <p>Port: <strong>${TRACE_PORT}</strong></p>
          <p>Endpoint: <strong>POST /trace</strong></p>
          <hr>
          <p>This server receives trace events from the Pulsar transformer.</p>
          <p>Events are displayed in VS Code's "Pulsar Tracer" panel.</p>
          <hr>
          <h3>Configuration:</h3>
          <pre>PULSAR_TRACE_HTTP='http://localhost:${TRACE_PORT}/trace'</pre>
        </body>
        </html>
      `);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 - Endpoint not found. Use POST /trace to send events.');
    }
  });

  traceServer.listen(TRACE_PORT, () => {
    isTracing = true;

    // Start webview recording
    if (webviewProvider) {
      webviewProvider.startRecording();
    }
    vscode.window.showInformationMessage(`Pulsar Tracer started on port ${TRACE_PORT}`);
  });

  traceServer.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      vscode.window.showErrorMessage(
        `Port ${TRACE_PORT} is already in use. Stop other tracer instances.`
      );
    } else {
      vscode.window.showErrorMessage(`Tracer error: ${error.message}`);
    }
    stopTracerServer();
  });
}

/**
 * Stop tracer HTTP server
 */
function stopTracerServer(): void {
  if (!traceServer) {
    vscode.window.showWarningMessage('Pulsar tracer is not running');
    return;
  }

  traceServer.close(() => {
    isTracing = false;

    // Stop webview recording
    if (webviewProvider) {
      webviewProvider.stopRecording();
    }

    traceChannel?.appendLine('');
    traceChannel?.appendLine('🛑 Pulsar Tracer Stopped');
    vscode.window.showInformationMessage('Pulsar Tracer stopped');
  });

  traceServer = null;
}

/**
 * Clear trace output
 */
function clearTraceOutput(): void {
  if (!traceChannel) {
    vscode.window.showWarningMessage('No trace output to clear');
    return;
  }

  traceChannel.clear();
  traceChannel.appendLine('🧹 Trace output cleared');

  // Clear webview too
  if (webviewProvider) {
    webviewProvider.clearEvents();
  }
}

/**
 * Export traces to file
 */
async function exportTraces(): Promise<void> {
  vscode.window.showInformationMessage(
    'Export feature coming soon! Currently traces are in Output Channel.'
  );
}

/**
 * Show tracer status
 */
function showTracerStatus(): void {
  const status = isTracing ? '✅ Running' : '⭕ Stopped';
  const port = isTracing ? ` on port ${TRACE_PORT}` : '';

  vscode.window.showInformationMessage(`Pulsar Tracer: ${status}${port}`);
}

export function activateTracer(context: vscode.ExtensionContext): void {
  // Register all commands at once
  context.subscriptions.push(
    vscode.commands.registerCommand('pulsar.tracer.start', () => {
      startTracerServer(context);
    }),
    vscode.commands.registerCommand('pulsar.tracer.stop', () => {
      stopTracerServer();
    }),
    vscode.commands.registerCommand('pulsar.tracer.clear', () => {
      clearTraceOutput();
    }),
    vscode.commands.registerCommand('pulsar.tracer.export', () => {
      exportTraces();
    }),
    vscode.commands.registerCommand('pulsar.tracer.status', () => {
      showTracerStatus();
    }),
    // Cleanup on deactivation
    {
      dispose: () => {
        if (traceServer) {
          stopTracerServer();
        }
      },
    }
  );
}
