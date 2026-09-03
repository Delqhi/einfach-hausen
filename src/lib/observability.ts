// T-0122 observability core: structured, privacy-safe logging with correlation
// IDs and a stable error taxonomy. One JSON line per log call, safe for journald
// ingestion. Never log user content, secrets, or identifiers beyond the
// pseudonymous ids passed in explicitly.

export type ErrorClass =
  | 'auth'
  | 'validation'
  | 'authorization'
  | 'rate_limit'
  | 'payment'
  | 'storage'
  | 'external_service'
  | 'database'
  | 'internal';

export interface LogContext {
  correlation_id?: string;
  user_id?: number;
  job_id?: number;
  event_id?: string | number;
  [key: string]: string | number | boolean | undefined;
}

import { redactDetail as sharedRedactDetail } from './security/redact';

function redact(detail: string): string {
  // Shared pattern set (T-0132) plus the logger-specific authorization shape.
  return sharedRedactDetail(detail).replace(/authorization:[^\s,]*/gi, 'authorization=[redacted]');
}

function emit(level: 'info' | 'warn' | 'error', errorClass: ErrorClass, message: string, context: LogContext = {}): void {
  const entry = {
    ts: new Date().toISOString(),
    level,
    error_class: errorClass,
    message: redact(message),
    ...context,
  };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const structuredLog = {
  info: (errorClass: ErrorClass, message: string, context?: LogContext) => emit('info', errorClass, message, context),
  warn: (errorClass: ErrorClass, message: string, context?: LogContext) => emit('warn', errorClass, message, context),
  error: (errorClass: ErrorClass, message: string, context?: LogContext) => emit('error', errorClass, message, context),
};

export function newCorrelationId(): string {
  return crypto.randomUUID();
}
