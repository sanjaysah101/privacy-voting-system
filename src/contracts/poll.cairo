use core::starknet::ContractAddress;
use core::array::ArrayTrait;
use core::option::OptionTrait;
use core::traits::Into;
use core::box::BoxTrait;
use starknet::storage_access::StorageAccess;
use starknet::storage::Store;
use starknet::get_caller_address;
use starknet::get_block_timestamp;
use starknet::storage::StorageBaseAddress;
use starknet::storage_access::StorageAddressSalt;
use starknet::storage::StorageMapMemberAddressTrait;
use starknet::storage::StorageMapMemberAccessTrait;

#[derive(Drop, Serde, starknet::Store)]
struct PollData {
    question: felt252,
    options: Array<felt252>,
    end_date: u64,
    is_private: bool,
    creator: ContractAddress,
    total_votes: u32,
}

#[derive(Drop, Serde, starknet::Store)]
struct Vote {
    poll_id: felt252,
    option_index: u32,
    voter: ContractAddress,
}

#[starknet::contract]
mod Poll {
    use super::{PollData, Vote};
    use core::starknet::ContractAddress;
    use core::array::ArrayTrait;
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;
    use core::traits::Into;

    #[storage]
    struct Storage {
        polls: Map<felt252, PollData>,
        votes: Map<(felt252, ContractAddress), bool>,
        poll_results: Map<(felt252, u32), u32>,
        poll_count: felt252,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.poll_count.write(0);
    }

    #[external(v0)]
    fn create_poll(
        ref self: ContractState,
        question: felt252,
        options: Array<felt252>,
        end_date: u64,
        is_private: bool,
    ) -> felt252 {
        // Get caller address
        let caller = get_caller_address();
        
        // Validate inputs
        assert(options.len() >= 2, 'Minimum 2 options required');
        assert(options.len() <= 5, 'Maximum 5 options allowed');
        
        // Get and increment poll count
        let poll_id = self.poll_count.read();
        self.poll_count.write(poll_id + 1);
        
        // Create new poll
        let poll = PollData {
            question,
            options,
            end_date,
            is_private,
            creator: caller,
            total_votes: 0,
        };
        
        // Store poll
        self.polls.write(poll_id, poll);
        
        poll_id
    }

    #[external(v0)]
    fn vote(
        ref self: ContractState,
        poll_id: felt252,
        option_index: u32,
    ) -> bool {
        let caller = get_caller_address();
        
        // Check if poll exists
        let poll = self.polls.read(poll_id);
        assert(poll.question != 0, 'Poll does not exist');
        
        // Check if voting period is active
        let block_timestamp = get_block_timestamp();
        assert(block_timestamp <= poll.end_date.into(), 'Voting period ended');
        
        // Check if user hasn't voted
        assert(!self.votes.read((poll_id, caller)), 'Already voted');
        
        // Check option index
        assert(option_index < poll.options.len(), 'Invalid option');
        
        // Record vote
        self.votes.write((poll_id, caller), true);
        let current_votes = self.poll_results.read((poll_id, option_index));
        self.poll_results.write((poll_id, option_index), current_votes + 1);
        
        // Update total votes
        let mut poll = self.polls.read(poll_id);
        poll.total_votes += 1;
        self.polls.write(poll_id, poll);
        
        true
    }

    #[external(v0)]
    fn get_poll(self: @ContractState, poll_id: felt252) -> PollData {
        let poll = self.polls.read(poll_id);
        assert(poll.question != 0, 'Poll does not exist');
        poll
    }

    #[external(v0)]
    fn get_results(self: @ContractState, poll_id: felt252) -> Array<u32> {
        let poll = self.polls.read(poll_id);
        assert(poll.question != 0, 'Poll does not exist');
        
        // Check if poll has ended or is not private
        let block_timestamp = get_block_timestamp();
        assert(
            block_timestamp > poll.end_date.into() || !poll.is_private,
            'Results not available'
        );
        
        let mut results = ArrayTrait::new();
        let mut i: u32 = 0;
        loop {
            if i >= poll.options.len() {
                break;
            }
            results.append(self.poll_results.read((poll_id, i)));
            i += 1;
        };
        
        results
    }
} 