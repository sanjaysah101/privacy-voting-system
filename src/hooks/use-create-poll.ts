'use client';

import { useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { usePollContract } from './use-poll-contract';
import { useToast } from '@/hooks/use-toast';
import { stringToFelt252, validateShortString } from '@/lib/utils/starknet';

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

    try {
      setIsSubmitting(true);

      // Validate strings before conversion
      if (!validateShortString(question)) {
        throw new Error(
          'Question must be 31 characters or less and contain only ASCII characters'
        );
      }

      if (options.some((opt) => !validateShortString(opt))) {
        throw new Error(
          'Each option must be 31 characters or less and contain only ASCII characters'
        );
      }

      const endTimestamp = BigInt(
        Math.floor(new Date(endDate).getTime() / 1000)
      );

      // Convert strings to felt252
      const questionFelt = stringToFelt252(question);
      const optionsFelts = options.map(stringToFelt252);

      // Call contract
      const result = await contract.functions.create_poll(
        questionFelt,
        optionsFelts,
        endTimestamp,
        BigInt(isPrivate ? 1 : 0)
      );

      toast({
        title: 'Success',
        description: `Poll creation submitted (tx: ${result.transaction_hash.slice(
          0,
          8
        )}...)`,
      });

      return true;
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to create poll',
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
