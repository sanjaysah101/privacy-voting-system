import { Abi } from '@starknet-react/core';

export const POLL_ABI: Abi = [
  {
    name: 'constructor',
    type: 'constructor',
    inputs: [],
  },
  {
    name: 'create_poll',
    type: 'function',
    inputs: [
      { name: 'question', type: 'felt252' },
      { name: 'options', type: 'Array<felt252>' },
      { name: 'end_date', type: 'u64' },
      { name: 'is_private', type: 'bool' },
    ],
    outputs: [{ type: 'felt252' }],
    state_mutability: 'external',
  },
  {
    name: 'vote',
    type: 'function',
    inputs: [
      { name: 'poll_id', type: 'felt252' },
      { name: 'option_index', type: 'u64' },
    ],
    outputs: [],
    state_mutability: 'external',
  },
  {
    name: 'get_poll',
    type: 'function',
    inputs: [{ name: 'poll_id', type: 'felt252' }],
    outputs: [{ type: 'Poll' }],
    state_mutability: 'view',
  },
  {
    name: 'get_poll_count',
    type: 'function',
    inputs: [],
    outputs: [{ type: 'felt252' }],
    state_mutability: 'view',
  },
  {
    name: 'has_voted',
    type: 'function',
    inputs: [
      { name: 'poll_id', type: 'felt252' },
      { name: 'voter', type: 'ContractAddress' },
    ],
    outputs: [{ type: 'bool' }],
    state_mutability: 'view',
  },
] as const;
