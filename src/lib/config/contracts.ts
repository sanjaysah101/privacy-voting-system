// Current network
export const CURRENT_NETWORK = 'testnet' as const;

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  [CURRENT_NETWORK]: {
    poll: '0x0123...' as `0x${string}`, // Replace with your actual contract address
  },
};

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
