export const LOANDISK_ORACLE_ABI = [
  'function executeRequest(string source, bytes secrets, string[] args, uint64 subscriptionId, uint32 gasLimit) returns (bytes32)',
  'function lastResponse() view returns (bytes)',
  'function lastError() view returns (bytes)',
  'event OCRResponse(bytes32 indexed requestId, bytes result, bytes err)',
  'event BorrowerDataUpdated(string borrowerId, uint256 balance)'
];

export const CCIP_BRIDGE_ABI = [
  'function sendMessage(string destinationChain, bytes payload, address token, uint256 amount) returns (bytes32)',
  'function getMessageStatus(bytes32 messageId) view returns (string)',
  'event MessageSent(bytes32 indexed messageId, address indexed sender)',
  'event MessageReceived(bytes32 indexed messageId, address indexed sender)',
  'event TokensTransferred(address token, uint256 amount, address recipient)'
];

export const CHAINLINK_SUPPORTED_NETWORKS = {
  ethereum: {
    name: 'Ethereum',
    chainId: 1,
    ccipRouter: '0x...',
    functionsRouter: '0x...'
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    ccipRouter: '0x...',
    functionsRouter: '0x...'
  },
  optimism: {
    name: 'Optimism',
    chainId: 10,
    ccipRouter: '0x...',
    functionsRouter: '0x...'
  },
  arbitrum: {
    name: 'Arbitrum',
    chainId: 42161,
    ccipRouter: '0x...',
    functionsRouter: '0x...'
  }
};