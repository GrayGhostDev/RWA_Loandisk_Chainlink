import { ethers } from 'ethers';
import { logger } from '../../utils/logger.js';

export enum AuditEventType {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  CONFIG_CHANGED = 'CONFIG_CHANGED'
}

interface AuditEvent {
  type: AuditEventType;
  userId?: string;
  data: any;
  metadata?: {
    ip?: string;
    userAgent?: string;
    timestamp: number;
    chainId?: number;
    blockNumber?: number;
  };
}

export class EventLogger {
  private static instance: EventLogger;
  private provider: ethers.providers.Provider;

  private constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      process.env.VITE_WEB3_PROVIDER_URL
    );
  }

  static getInstance(): EventLogger {
    if (!EventLogger.instance) {
      EventLogger.instance = new EventLogger();
    }
    return EventLogger.instance;
  }

  async logEvent(event: AuditEvent): Promise<void> {
    try {
      const [blockNumber, network] = await Promise.all([
        this.provider.getBlockNumber(),
        this.provider.getNetwork()
      ]);

      const enrichedEvent = {
        ...event,
        metadata: {
          ...event.metadata,
          timestamp: Date.now(),
          chainId: network.chainId,
          blockNumber
        }
      };

      // Log to application logger
      logger.info('Audit event', enrichedEvent);

      // In a production environment, you might want to:
      // 1. Store in a database
      // 2. Send to a monitoring service
      // 3. Emit blockchain events
      // 4. Forward to security information and event management (SIEM) system
    } catch (error) {
      logger.error('Failed to log audit event', { error, event });
    }
  }

  async logSecurityEvent(
    userId: string,
    eventType: string,
    details: any
  ): Promise<void> {
    await this.logEvent({
      type: AuditEventType.SECURITY_VIOLATION,
      userId,
      data: {
        eventType,
        details
      }
    });
  }

  async logTransactionEvent(
    userId: string,
    transactionId: string,
    status: 'created' | 'completed' | 'failed',
    details: any
  ): Promise<void> {
    const eventType = status === 'created'
      ? AuditEventType.TRANSACTION_CREATED
      : status === 'completed'
        ? AuditEventType.TRANSACTION_COMPLETED
        : AuditEventType.TRANSACTION_FAILED;

    await this.logEvent({
      type: eventType,
      userId,
      data: {
        transactionId,
        ...details
      }
    });
  }
}