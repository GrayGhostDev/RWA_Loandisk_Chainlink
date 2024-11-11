import { ethers } from 'ethers';
import { CCIP_BRIDGE_ABI } from '@/config/contracts';

export class ChainlinkCCIP {
  private contract: ethers.Contract;

  constructor(
    contractAddress: string,
    signer: ethers.Signer
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      CCIP_BRIDGE_ABI,
      signer
    );
  }

  async sendCrossChainData(
    sourceChain: string,
    destinationChain: string,
    payload: any,
    token?: string,
    amount?: ethers.BigNumber
  ) {
    try {
      const message = {
        sourceChain,
        destinationChain,
        payload: ethers.utils.defaultAbiCoder.encode(
          ['string'],
          [JSON.stringify(payload)]
        ),
        token,
        amount
      };

      const tx = await this.contract.sendMessage(
        message.destinationChain,
        message.payload,
        message.token,
        message.amount
      );

      const receipt = await tx.wait();
      return {
        txHash: receipt.transactionHash,
        messageId: receipt.events?.[0].args?.messageId
      };
    } catch (error) {
      console.error('Error sending CCIP message:', error);
      throw error;
    }
  }

  async getMessageStatus(messageId: string) {
    try {
      const status = await this.contract.getMessageStatus(messageId);
      return status;
    } catch (error) {
      console.error('Error getting message status:', error);
      throw error;
    }
  }
}