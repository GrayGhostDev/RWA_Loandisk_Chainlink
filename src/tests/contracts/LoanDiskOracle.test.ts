import { describe, it, expect, beforeEach } from 'vitest';
import { ethers } from 'ethers';
import { LoanDiskOracle__factory } from '../typechain-types';

describe('LoanDiskOracle', () => {
  let oracle: any;
  let owner: any;
  let user: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    
    const OracleFactory = await ethers.getContractFactory('LoanDiskOracle');
    oracle = await OracleFactory.deploy(ethers.constants.AddressZero);
    await oracle.deployed();
  });

  describe('executeRequest', () => {
    it('should execute request successfully', async () => {
      const source = "return Functions.encodeString(JSON.stringify({ id: '123', balance: 1000 }))";
      const secrets = '0x';
      const args = ['arg1', 'arg2'];
      const subscriptionId = 1;
      const gasLimit = 300000;

      const tx = await oracle.executeRequest(
        source,
        secrets,
        args,
        subscriptionId,
        gasLimit
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });

    it('should only allow owner to execute request', async () => {
      const source = "return Functions.encodeString('test')";
      
      await expect(
        oracle.connect(user).executeRequest(
          source,
          '0x',
          [],
          1,
          300000
        )
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});