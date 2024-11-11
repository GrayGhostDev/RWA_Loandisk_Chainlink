// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/functions/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/FunctionsRequest.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoanDiskOracle is FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public lastRequestId;
    bytes public lastResponse;
    bytes public lastError;
    
    event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
    event BorrowerDataUpdated(string borrowerId, uint256 balance);

    constructor(address router) FunctionsClient(router) {}

    function executeRequest(
        string calldata source,
        bytes calldata secrets,
        string[] calldata args,
        uint64 subscriptionId,
        uint32 gasLimit
    ) public onlyOwner returns (bytes32) {
        FunctionsRequest.Request memory req;
        req.initializeRequest(
            FunctionsRequest.Location.Inline,
            FunctionsRequest.CodeLanguage.JavaScript,
            source
        );

        if (secrets.length > 0) {
            req.addRemoteSecrets(secrets);
        }

        if (args.length > 0) {
            req.addArgs(args);
        }

        bytes32 assignedReqID = sendRequest(
            req,
            subscriptionId,
            gasLimit,
            tx.gasprice
        );

        lastRequestId = assignedReqID;
        return assignedReqID;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        lastResponse = response;
        lastError = err;
        emit OCRResponse(requestId, response, err);

        if (response.length > 0) {
            // Parse and process the response
            // This would typically decode the response and update state
            emit BorrowerDataUpdated(string(response), 0);
        }
    }
}