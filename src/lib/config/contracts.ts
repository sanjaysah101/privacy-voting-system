// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  testnet: {
    poll: '', // Will be filled after deployment
  },
  mainnet: {
    poll: '', // Will be filled after mainnet deployment
  },
} as const;

// Network configuration
export const NETWORKS = {
  testnet: {
    name: 'sepolia',
    chainId: 'SN_SEPOLIA',
    baseUrl: 'https://alpha-sepolia.starknet.io',
  },
  mainnet: {
    name: 'mainnet',
    chainId: 'SN_MAIN',
    baseUrl: 'https://alpha-mainnet.starknet.io',
  },
} as const;

// Current network
export const CURRENT_NETWORK = 'testnet' as const;
