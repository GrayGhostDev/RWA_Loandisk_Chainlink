import { ethers } from 'ethers';
import { Functions } from '@chainlink/functions-toolkit';
import { LOANDISK_ORACLE_ABI } from '@/config/contracts';

export class ChainlinkFunctions {
  private contract: ethers.Contract;
  private functions: Functions;

  constructor(
    contractAddress: string,
    signer: ethers.Signer
  ) {
    this.contract = new ethers.Contract(
      contractAddress,
      LOANDISK_ORACLE_ABI,
      signer
    );
    this.functions = new Functions();
  }

  async fetchBorrowerData(borrowerId: string) {
    const source = `
      const borrowerUrl = args[0];
      const apiKey = secrets.apiKey;
      
      const response = await Functions.makeHttpRequest({
        url: \`\${borrowerUrl}/\${args[1]}\`,
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.error) {
        throw Error('Request failed');
      }
      
      const { data } = response;
      return Functions.encodeString(JSON.stringify({
        borrowerId: data.id,
        status: data.status,
        balance: data.balance,
        lastUpdate: data.lastUpdate
      }));
    `;

    const args = [
      process.env.VITE_LOANDISK_API_URL!,
      borrowerId
    ];

    const secrets = {
      apiKey: process.env.VITE_LOANDISK_API_KEY!
    };

    try {
      const request = await this.functions.buildRequest(source, args, secrets);
      const tx = await this.contract.executeRequest(
        request.source,
        request.secrets ?? '0x',
        request.args,
        process.env.VITE_CHAINLINK_SUBSCRIPTION_ID!,
        300000 // gas limit
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error executing Chainlink Function:', error);
      throw error;
    }
  }

  async getLastResponse() {
    return await this.contract.lastResponse();
  }

  async getLastError() {
    return await this.contract.lastError();
  }
}