import { ethers } from 'ethers';
import { USDT_ABI, USDC_ABI } from '@/config/contracts';

export class Web3Service {
  private provider: ethers.providers.Web3Provider;
  private usdtContract: ethers.Contract;
  private usdcContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    
    this.usdtContract = new ethers.Contract(
      import.meta.env.VITE_USDT_CONTRACT_ADDRESS,
      USDT_ABI,
      this.provider
    );

    this.usdcContract = new ethers.Contract(
      import.meta.env.VITE_USDC_CONTRACT_ADDRESS,
      USDC_ABI,
      this.provider
    );
  }

  async getUSDTBalance(address: string): Promise<string> {
    const balance = await this.usdtContract.balanceOf(address);
    return ethers.utils.formatUnits(balance, 6);
  }

  async getUSDCBalance(address: string): Promise<string> {
    const balance = await this.usdcContract.balanceOf(address);
    return ethers.utils.formatUnits(balance, 6);
  }
}

export const web3Service = new Web3Service();