// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts-ccip/src/v0.8/ccip/CCIPReceiver.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CCIPLoanBridge is CCIPReceiver, OwnerIsCreator {
    uint64 public destinationChainSelector;
    address public destinationContract;
    
    event MessageSent(bytes32 messageId);
    event MessageReceived(bytes32 messageId, address sender);
    event TokensTransferred(address token, uint256 amount, address recipient);

    constructor(address router, uint64 _destinationChainSelector) CCIPReceiver(router) {
        destinationChainSelector = _destinationChainSelector;
    }

    function setDestinationContract(address _contract) external onlyOwner {
        destinationContract = _contract;
    }

    function sendLoanData(
        address token,
        uint256 amount,
        bytes memory loanData
    ) external returns (bytes32 messageId) {
        require(destinationContract != address(0), "Destination not set");
        
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(destinationContract),
            data: loanData,
            tokenAmounts: new Client.EVMTokenAmount[](1),
            extraArgs: "",
            feeToken: token
        });

        message.tokenAmounts[0] = Client.EVMTokenAmount({
            token: token,
            amount: amount
        });

        IERC20(token).approve(address(this), amount);
        
        uint256 fees = IRouterClient(i_router).getFee(
            destinationChainSelector,
            message
        );

        messageId = IRouterClient(i_router).ccipSend{value: fees}(
            destinationChainSelector,
            message
        );

        emit MessageSent(messageId);
        return messageId;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        bytes32 messageId = message.messageId;
        address sender = abi.decode(message.sender, (address));

        if (message.tokenAmounts.length > 0) {
            for (uint256 i = 0; i < message.tokenAmounts.length; i++) {
                emit TokensTransferred(
                    message.tokenAmounts[i].token,
                    message.tokenAmounts[i].amount,
                    address(this)
                );
            }
        }

        _processLoanData(message.data);
        
        emit MessageReceived(messageId, sender);
    }

    function _processLoanData(bytes memory data) internal {
        // Implement loan data processing logic
    }

    function withdrawToken(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        IERC20(token).transfer(to, amount);
    }

    function withdrawNative(address to, uint256 amount) external onlyOwner {
        (bool success,) = to.call{value: amount}("");
        require(success, "Native token transfer failed");
    }

    receive() external payable {}
}