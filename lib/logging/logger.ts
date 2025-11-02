/**
 * Structured Logging Service
 * Provides consistent logging with levels and context
 */

import { isDevelopment, isProduction } from "@/lib/config/env";
import { serializeError } from "@/lib/errors";

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: unknown;
}

/**
 * Logger class with structured logging capabilities
 */
class Logger {
  private readonly namespace?: string;

  constructor(namespace?: string) {
    this.namespace = namespace;
  }

  /**
   * Creates a child logger with a namespace
   */
  child(namespace: string): Logger {
    const fullNamespace = this.namespace
      ? `${this.namespace}:${namespace}`
      : namespace;
    return new Logger(fullNamespace);
  }

  /**
   * Formats log entry for output
   */
  private formatEntry(entry: LogEntry): string {
    const prefix = this.namespace ? `[${this.namespace}]` : "";
    const timestamp = new Date(entry.timestamp).toISOString();

    if (isDevelopment()) {
      // Human-readable format for development
      const contextStr = entry.context
        ? ` ${JSON.stringify(entry.context, null, 2)}`
        : "";
      const errorStr = entry.error ? `\n${JSON.stringify(serializeError(entry.error), null, 2)}` : "";
      return `${timestamp} ${entry.level.toUpperCase()} ${prefix} ${entry.message}${contextStr}${errorStr}`;
    }

    // JSON format for production (easier to parse)
    return JSON.stringify({
      timestamp,
      level: entry.level,
      namespace: this.namespace,
      message: entry.message,
      ...(entry.context && { context: entry.context }),
      ...(entry.error && { error: serializeError(entry.error) }),
    });
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: LogContext, error?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    const formatted = this.formatEntry(entry);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        break;
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: LogContext): void {
    if (!isProduction()) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext, error?: unknown): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  /**
   * Error level logging
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context, error);
  }
}

/**
 * Creates a logger instance with optional namespace
 */
export function createLogger(namespace?: string): Logger {
  return new Logger(namespace);
}

/**
 * Default application logger
 */
export const logger = createLogger();
