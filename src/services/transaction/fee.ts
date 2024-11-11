import { ethers } from 'ethers';
import { TransactionType } from '@/types/transaction';

export class FeeCalculator {
  private static readonly BASE_FEE_PERCENTAGE = 0.001; // 0.1%
  private static readonly VOLUME_DISCOUNT_THRESHOLD = ethers.utils.parseUnits('10000', 6);
  private static readonly VOLUME_DISCOUNT_PERCENTAGE = 0.0005; // 0.05%

  static calculateFee(
    amount: ethers.BigNumber,
    type: TransactionType,
    userTotalVolume?: ethers.BigNumber
  ): ethers.BigNumber {
    let feePercentage = this.BASE_FEE_PERCENTAGE;

    // Apply volume discount if applicable
    if (userTotalVolume?.gte(this.VOLUME_DISCOUNT_THRESHOLD)) {
      feePercentage = this.VOLUME_DISCOUNT_PERCENTAGE;
    }

    // Calculate fee
    const fee = amount.mul(
      ethers.utils.parseUnits(feePercentage.toString(), 6)
    ).div(ethers.utils.parseUnits('1', 6));

    return fee;
  }

  static getNetAmount(amount: ethers.BigNumber, fee: ethers.BigNumber): ethers.BigNumber {
    return amount.sub(fee);
  }
}