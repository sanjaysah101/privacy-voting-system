'use client';

import { useContract } from '@starknet-react/core';
import { CONTRACT_ADDRESSES, CURRENT_NETWORK } from '@/lib/config/contracts';
import { POLL_ABI } from '@/lib/config/poll-abi';

export function usePollContract() {
  return useContract({
    address: CONTRACT_ADDRESSES[CURRENT_NETWORK].poll,
    abi: POLL_ABI,
  });
}
