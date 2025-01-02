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

      const endTimestamp = BigInt(
        Math.floor(new Date(endDate).getTime() / 1000)
      );

      // Convert strings to felt252
      try {
        const questionFelt = stringToFelt252(question);
        const optionsFelt = stringsToFelt252Array(options);

        // Call contract
        const result = await contract.functions.create_poll(
          questionFelt,
          optionsFelt,
          endTimestamp,
          isPrivate ? BigInt(1) : BigInt(0)
        );

        if (!result.transaction_hash) {
          throw new Error('Transaction failed - no transaction hash received');
        }

        toast({
          title: 'Success',
          description: `Poll creation submitted (tx: ${result.transaction_hash.slice(
            0,
            8
          )}...)`,
        });

        return true;
      } catch (error) {
        throw new Error(
          `Invalid input: Text must be 31 characters or less and contain only ASCII characters ${error}`
        );
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      let errorMessage = 'Failed to create poll. Please try again.';

      if (error instanceof Error) {
        const errorStr = error.message.toLowerCase();
        if (errorStr.includes('insufficient') || errorStr.includes('balance')) {
          errorMessage = 'Insufficient funds. Please add funds to your wallet.';
        } else if (errorStr.includes('gas')) {
          errorMessage = 'Not enough gas. Please add funds to your wallet.';
        } else if (
          errorStr.includes('validate') ||
          errorStr.includes('invalid input')
        ) {
          errorMessage = error.message;
        }
      }

      toast({
        title: 'Error',
        description: errorMessage,
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
