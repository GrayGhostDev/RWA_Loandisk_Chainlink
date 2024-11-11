import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Ethereum } from "@thirdweb-dev/chains";

export const CHAIN = Ethereum;

export const SDK_OPTIONS = {
  gasless: {
    openzeppelin: {
      relayerUrl: process.env.VITE_RELAYER_URL,
    },
  },
};

export const getSDK = async (signer: any) => {
  return await ThirdwebSDK.fromSigner(signer, CHAIN.chainId, {
    ...SDK_OPTIONS,
  });
};