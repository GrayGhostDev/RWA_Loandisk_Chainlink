import { config } from '../config.js';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, meta?: unknown) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
      environment: config.nodeEnv,
    };

    if (config.nodeEnv === 'test') return;
    console[level](JSON.stringify(logData));
  }

  info(message: string, meta?: unknown) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: unknown) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: unknown) {
    this.log('error', message, meta);
  }

  debug(message: string, meta?: unknown) {
    if (config.nodeEnv === 'development') {
      this.log('debug', message, meta);
    }
  }
}

export const logger = new Logger();