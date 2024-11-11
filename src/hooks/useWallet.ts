import { useState, useCallback } from 'react';
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';

export const useWallet = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      await connectWithMetamask();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [connectWithMetamask]);

  return {
    address,
    connect,
    disconnect,
    isConnecting
  };
};