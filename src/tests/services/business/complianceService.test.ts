import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComplianceService } from '../../../services/business/complianceService';
import { ValidationError } from '../../../utils/errors';
import { ethers } from 'ethers';
import { EventLogger } from '../../../services/audit/eventLogger';

describe('ComplianceService', () => {
  let complianceService: ComplianceService;
  let mockEventLogger: jest.Mocked<EventLogger>;

  beforeEach(() => {
    mockEventLogger = {
      logSecurityEvent: vi.fn(),
      logEvent: vi.fn(),
    } as any;

    vi.spyOn(EventLogger, 'getInstance').mockReturnValue(mockEventLogger);
    complianceService = new ComplianceService();
  });

  describe('validateTransaction', () => {
    it('requires KYC for large transactions', async () => {
      const amount = ethers.utils.parseUnits('20000', 6);

      await expect(
        complianceService.validateTransaction(
          'user123',
          amount,
          'unverified',
          'US'
        )
      ).rejects.toThrow(ValidationError);

      expect(mockEventLogger.logSecurityEvent).toHaveBeenCalledWith(
        'user123',
        'KYC_REQUIRED',
        expect.any(Object)
      );
    });

    it('blocks transactions from restricted countries', async () => {
      const amount = ethers.utils.parseUnits('1000', 6);

      await expect(
        complianceService.validateTransaction(
          'user123',
          amount,
          'verified',
          'XX'
        )
      ).rejects.toThrow(ValidationError);

      expect(mockEventLogger.logSecurityEvent).toHaveBeenCalledWith(
        'user123',
        'RESTRICTED_COUNTRY',
        expect.any(Object)
      );
    });

    it('allows valid transactions', async () => {
      const amount = ethers.utils.parseUnits('1000', 6);

      await expect(
        complianceService.validateTransaction(
          'user123',
          amount,
          'verified',
          'US'
        )
      ).resolves.not.toThrow();
    });
  });
});