'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import { usePollContract } from './use-poll-contract';
import { Poll } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function usePolls() {
  const { address } = useAccount();
  const { contract } = usePollContract();
  const { toast } = useToast();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPolls = useCallback(async () => {
    if (!contract) return;

    try {
      const count = await contract.get_poll_count();
      const pollsData = [];

      for (let i = 1; i <= count; i++) {
        const poll = await contract.get_poll(i);
        pollsData.push(poll);
      }

      setPolls(pollsData);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch polls',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [contract, toast]);

  useEffect(() => {
    fetchPolls();
  }, [contract, fetchPolls]);

  const vote = async (pollId: string, optionIndex: number) => {
    if (!contract || !address) return;

    try {
      await contract.vote(pollId, optionIndex);
      toast({
        title: 'Success',
        description: 'Vote submitted successfully',
      });
      await fetchPolls(); // Refresh polls
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit vote',
        variant: 'destructive',
      });
    }
  };

  return {
    polls,
    loading,
    vote,
    refresh: fetchPolls,
  };
}
