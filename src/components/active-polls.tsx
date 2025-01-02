'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock } from 'lucide-react';
import { usePolls } from '@/hooks/use-polls';
import { Progress } from '@/components/ui/progress';

export function ActivePolls() {
  const { polls, loading, vote } = usePolls();

  if (loading) {
    return <div className="text-center text-foreground">Loading polls...</div>;
  }

  if (polls.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No active polls available. Create one to get started!
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {polls.map((poll) => {
        const totalVotes = poll.voteCounts.reduce((a, b) => a + b, 0);

        return (
          <Card key={poll.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-card-foreground">
                {poll.question}
              </h3>
              {poll.isPrivate ? (
                <Lock className="h-5 w-5 text-green-500" />
              ) : (
                <Unlock className="h-5 w-5 text-yellow-500" />
              )}
            </div>

            <div className="space-y-4">
              {poll.options.map((option, index) => (
                <div key={index} className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => vote(poll.id, index)}
                  >
                    <span>{option}</span>
                    <span className="text-muted-foreground">
                      {poll.voteCounts[index]} votes
                    </span>
                  </Button>
                  <Progress
                    value={
                      totalVotes > 0
                        ? (poll.voteCounts[index] / totalVotes) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Ends: {new Date(poll.endDate).toLocaleString()}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
