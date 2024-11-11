import { ethers } from 'ethers';
import { USDT_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from '@/config/constants';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 value) returns (bool)',
  'function approve(address spender, uint256 value) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

export const getTokenContract = (
  address: string,
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) => {
  return new ethers.Contract(address, ERC20_ABI, signerOrProvider);
};

export const getUSDTContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  return getTokenContract(USDT_CONTRACT_ADDRESS, signerOrProvider);
};

export const getUSDCContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) => {
  return getTokenContract(USDC_CONTRACT_ADDRESS, signerOrProvider);
};