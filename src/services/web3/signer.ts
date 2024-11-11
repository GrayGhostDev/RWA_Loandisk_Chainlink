import { ethers } from 'ethers';
import { getProvider } from './provider';

export const getSigner = async () => {
  const provider = getProvider();
  
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    return web3Provider.getSigner();
  }
  
  throw new Error('No Web3 provider available');
};