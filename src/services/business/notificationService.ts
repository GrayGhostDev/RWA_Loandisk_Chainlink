import { EventLogger } from '../audit/eventLogger';
import { NotificationChannel, NotificationType } from '@/types/notification';

export class NotificationService {
  private eventLogger: EventLogger;

  constructor() {
    this.eventLogger = EventLogger.getInstance();
  }

  async sendNotification(
    userId: string,
    type: NotificationType,
    data: any,
    channels: NotificationChannel[] = ['email', 'in_app']
  ): Promise<void> {
    try {
      const notifications = channels.map(channel =>
        this.sendToChannel(userId, type, data, channel)
      );

      await Promise.all(notifications);

      await this.eventLogger.logEvent({
        type: 'NOTIFICATION_SENT',
        userId,
        data: { type, channels }
      });
    } catch (error) {
      await this.eventLogger.logEvent({
        type: 'NOTIFICATION_FAILED',
        userId,
        data: { type, channels, error: error.message }
      });
      throw error;
    }
  }

  private async sendToChannel(
    userId: string,
    type: NotificationType,
    data: any,
    channel: NotificationChannel
  ): Promise<void> {
    switch (channel) {
      case 'email':
        // Implement email sending
        break;
      case 'sms':
        // Implement SMS sending
        break;
      case 'in_app':
        // Implement in-app notification
        break;
      default:
        throw new Error(`Unsupported notification channel: ${channel}`);
    }
  }
}