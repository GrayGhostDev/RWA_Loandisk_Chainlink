import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RiskManager } from '../../../services/business/riskManager';
import { ethers } from 'ethers';
import { EventLogger } from '../../../services/audit/eventLogger';

describe('RiskManager', () => {
  let riskManager: RiskManager;
  let mockEventLogger: jest.Mocked<EventLogger>;

  beforeEach(() => {
    mockEventLogger = {
      logSecurityEvent: vi.fn(),
      logEvent: vi.fn(),
    } as any;

    vi.spyOn(EventLogger, 'getInstance').mockReturnValue(mockEventLogger);
    riskManager = new RiskManager();
  });

  describe('assessTransactionRisk', () => {
    it('identifies high-risk transactions', async () => {
      const amount = ethers.utils.parseUnits('60000', 6);
      const result = await riskManager.assessTransactionRisk(
        'user123',
        amount,
        []
      );

      expect(result.riskLevel).toBe('high');
      expect(result.requiresApproval).toBe(true);
      expect(mockEventLogger.logSecurityEvent).toHaveBeenCalled();
    });

    it('identifies low-risk transactions', async () => {
      const amount = ethers.utils.parseUnits('1000', 6);
      const result = await riskManager.assessTransactionRisk(
        'user123',
        amount,
        []
      );

      expect(result.riskLevel).toBe('low');
      expect(result.requiresApproval).toBe(false);
    });
  });
});