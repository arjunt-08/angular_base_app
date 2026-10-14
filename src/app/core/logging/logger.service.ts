import { Injectable, inject } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { MonitoringService } from '../monitoring/monitoring.service';
import { LogEntry, LogLevel } from './logger.model';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly config = inject(ConfigService);
  private readonly monitoring = inject(MonitoringService);

  private readonly levelWeights: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
  };

  private readonly sensitivePatterns = [
    /pass(word)?/i,
    /token/i,
    /secret/i,
    /authorization/i,
    /key/i,
    /credit.*card/i,
    /cvv/i,
  ];

  debug(message: string, context?: string, data?: unknown): void {
    this.log('debug', message, context, data);
  }

  info(message: string, context?: string, data?: unknown): void {
    this.log('info', message, context, data);
  }

  warn(message: string, context?: string, data?: unknown): void {
    this.log('warn', message, context, data);
  }

  error(message: string, context?: string, errorOrData?: unknown): void {
    this.log('error', message, context, errorOrData);

    if (errorOrData instanceof Error) {
      this.monitoring.captureException(errorOrData, { context, message });
    } else {
      this.monitoring.captureMessage(`[${context ?? 'App'}] ${message}`, 'error');
    }
  }

  private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
    const configuredLevel = this.config.logLevel;
    if (this.levelWeights[level] < this.levelWeights[configuredLevel]) {
      return;
    }

    const sanitizedData = data !== undefined ? this.sanitize(data) : undefined;
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data: sanitizedData,
    };

    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]${context ? ` [${context}]` : ''}:`;

    switch (level) {
      case 'debug':
        // eslint-disable-next-line no-console
        console.debug(prefix, message, sanitizedData ?? '');
        break;
      case 'info':
        // eslint-disable-next-line no-console
        console.info(prefix, message, sanitizedData ?? '');
        break;
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(prefix, message, sanitizedData ?? '');
        break;
      case 'error':
        // eslint-disable-next-line no-console
        console.error(prefix, message, sanitizedData ?? '');
        break;
    }
  }

  private sanitize(input: unknown): unknown {
    if (!input || typeof input !== 'object') {
      return input;
    }

    if (input instanceof Error) {
      return {
        name: input.name,
        message: input.message,
        stack: input.stack,
      };
    }

    if (Array.isArray(input)) {
      return input.map((item) => this.sanitize(item));
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (this.isSensitiveKey(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  private isSensitiveKey(key: string): boolean {
    return this.sensitivePatterns.some((pattern) => pattern.test(key));
  }
}
