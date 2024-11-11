import { ethers } from 'ethers';
import { config } from '@/config';

let provider: ethers.providers.JsonRpcProvider;

export const getProvider = () => {
  if (!provider) {
    provider = new ethers.providers.JsonRpcProvider(config.web3.providerUrl);
  }
  return provider;
};

export const getChainId = async () => {
  const provider = getProvider();
  const network = await provider.getNetwork();
  return network.chainId;
};