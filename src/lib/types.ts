import { ReactNode } from 'react';

export interface Children {
  children: ReactNode;
}

export interface Poll {
  id: string;
  creator: string;
  question: string;
  options: string[];
  endDate: Date;
  isPrivate: boolean;
  voteCounts: number[];
}

export interface Vote {
  pollId: string;
  optionIndex: number;
  voterAddress: string;
  timestamp: Date;
}

export interface PollContractFunctions {
  createPoll: (args: {
    question: string;
    options: string[];
    endDate: number;
    isPrivate: boolean;
  }) => Promise<string>;

  vote: (args: { pollId: string; optionIndex: number }) => Promise<void>;

  getPoll: (pollId: string) => Promise<Poll>;
  getPollCount: () => Promise<number>;
  hasVoted: (args: { pollId: string; voter: string }) => Promise<boolean>;
}
