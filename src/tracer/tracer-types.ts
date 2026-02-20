/**
 * Shared tracer types for VS Code extension
 * Re-exports from @pulsar-framework/dev-tools when available,
 * with local fallback for extension-only builds.
 */

export interface TraceEvent {
  timestamp: number;
  channel: string;
  type: string;
  name?: string;
  duration?: number;
  error?: Error;
  [key: string]: unknown;
}
