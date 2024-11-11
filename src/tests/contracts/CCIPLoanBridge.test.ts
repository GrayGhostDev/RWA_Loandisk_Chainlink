import { describe, it, expect, beforeEach } from 'vitest';
import { ethers } from 'ethers';
import { CCIPLoanBridge__factory } from '../typechain-types';

describe('CCIPLoanBridge', () => {
  let bridge: any;
  let owner: any;
  let user: any;
  let mockToken: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    
    // Deploy mock token
    const MockToken = await ethers.getContractFactory('MockERC20');
    mockToken = await MockToken.deploy('Mock Token', 'MTK');
    await mockToken.deployed();

    // Deploy bridge
    const BridgeFactory = await ethers.getContractFactory('CCIPLoanBridge');
    bridge = await BridgeFactory.deploy(
      ethers.constants.AddressZero,
      1 // destination chain selector
    );
    await bridge.deployed();
  });

  describe('sendLoanData', () => {
    it('should send loan data successfully', async () => {
      const destinationContract = ethers.Wallet.createRandom().address;
      await bridge.setDestinationContract(destinationContract);

      const amount = ethers.utils.parseUnits('100', 18);
      const loanData = ethers.utils.defaultAbiCoder.encode(
        ['uint256', 'string'],
        [amount, 'test loan']
      );

      await mockToken.approve(bridge.address, amount);

      const tx = await bridge.sendLoanData(
        mockToken.address,
        amount,
        loanData
      );

      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'MessageSent');
      expect(event).to.not.be.undefined;
    });

    it('should revert if destination contract not set', async () => {
      await expect(
        bridge.sendLoanData(
          mockToken.address,
          100,
          '0x'
        )
      ).to.be.revertedWith('Destination not set');
    });
  });

  describe('withdrawToken', () => {
    it('should allow owner to withdraw tokens', async () => {
      const amount = ethers.utils.parseUnits('100', 18);
      await mockToken.transfer(bridge.address, amount);

      await bridge.withdrawToken(
        mockToken.address,
        owner.address,
        amount
      );

      const balance = await mockToken.balanceOf(owner.address);
      expect(balance).to.equal(amount);
    });

    it('should only allow owner to withdraw', async () => {
      await expect(
        bridge.connect(user).withdrawToken(
          mockToken.address,
          user.address,
          100
        )
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});