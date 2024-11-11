import { useState } from 'react';
import { ethers } from 'ethers';
import { useThirdwebSDK } from './useThirdwebSDK';
import { useNotifications } from './useNotifications';
import { USDT_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from '@/config/constants';

export const useConversion = () => {
  const { sdk } = useThirdwebSDK();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const convert = async (amount: number, type: 'USDT' | 'USDC') => {
    if (!sdk) throw new Error('SDK not initialized');

    try {
      setIsLoading(true);
      const signer = await sdk.getSigner();
      const tokenAddress = type === 'USDT' ? USDT_CONTRACT_ADDRESS : USDC_CONTRACT_ADDRESS;
      const contract = await sdk.getContract(tokenAddress);
      
      const value = ethers.utils.parseUnits(amount.toString(), 6);
      const tx = await contract.erc20.mint(value);
      const receipt = await tx.wait();

      addNotification({
        type: 'success',
        title: 'Conversion Successful',
        message: `Successfully converted ${amount} to ${type}`,
      });

      return receipt;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Conversion failed';
      addNotification({
        type: 'error',
        title: 'Conversion Failed',
        message,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { convert, isLoading };
};