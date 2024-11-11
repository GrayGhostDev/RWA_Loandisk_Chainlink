import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationService } from '../../../services/business/notificationService';
import { EventLogger } from '../../../services/audit/eventLogger';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let mockEventLogger: jest.Mocked<EventLogger>;

  beforeEach(() => {
    mockEventLogger = {
      logEvent: vi.fn(),
    } as any;

    vi.spyOn(EventLogger, 'getInstance').mockReturnValue(mockEventLogger);
    notificationService = new NotificationService();
  });

  describe('sendNotification', () => {
    it('sends notifications through specified channels', async () => {
      await notificationService.sendNotification(
        'user123',
        'TRANSACTION_COMPLETED',
        { transactionId: 'tx123' },
        ['email', 'in_app']
      );

      expect(mockEventLogger.logEvent).toHaveBeenCalledWith({
        type: 'NOTIFICATION_SENT',
        userId: 'user123',
        data: expect.any(Object)
      });
    });

    it('handles notification failures', async () => {
      const error = new Error('Failed to send');
      vi.spyOn(notificationService as any, 'sendToChannel')
        .mockRejectedValueOnce(error);

      await expect(
        notificationService.sendNotification(
          'user123',
          'TRANSACTION_FAILED',
          { error: 'test error' }
        )
      ).rejects.toThrow();

      expect(mockEventLogger.logEvent).toHaveBeenCalledWith({
        type: 'NOTIFICATION_FAILED',
        userId: 'user123',
        data: expect.any(Object)
      });
    });
  });
});