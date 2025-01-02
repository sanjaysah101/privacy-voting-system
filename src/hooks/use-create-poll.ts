'use client';

import { useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { usePollContract } from './use-poll-contract';
import { useToast } from '@/hooks/use-toast';
import {
  stringToFelt252,
  stringsToFelt252Array,
  validateShortString,
} from '@/lib/utils/starknet';

export function useCreatePoll() {
  const { address } = useAccount();
  const { contract } = usePollContract();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPoll = async (
    question: string,
    options: string[],
    endDate: string,
    isPrivate: boolean
  ) => {
    if (!contract || !address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return false;
    }

    // Validate string lengths for StarkNet
    if (!validateShortString(question)) {
      toast({
        title: 'Error',
        description: 'Question is too long for StarkNet storage',
        variant: 'destructive',
      });
      return false;
    }

    if (options.some((opt) => !validateShortString(opt))) {
      toast({
        title: 'Error',
        description: 'One or more options are too long',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsSubmitting(true);

      const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

      // Convert strings to felt252
      const questionFelt = stringToFelt252(question);
      const optionsFelt = stringsToFelt252Array(options);

      // Call contract
      const tx = await contract.invoke('create_poll', [
        questionFelt,
        optionsFelt,
        endTimestamp,
        isPrivate ? 1 : 0,
      ]);

      await tx.wait();

      toast({
        title: 'Success',
        description: 'Poll created successfully',
      });

      return true;
    } catch (error: any) {
      console.error('Error creating poll:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to create poll. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createPoll,
    isSubmitting,
  };
}
