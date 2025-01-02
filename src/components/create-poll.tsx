'use client';

import { useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { useCreatePoll } from '@/hooks/use-create-poll';
import { usePollContract } from '@/hooks/use-poll-contract';

export function CreatePoll() {
  const { address } = useAccount();
  const { contract } = usePollContract();
  const { createPoll, isSubmitting } = useCreatePoll();
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isPrivate, setIsPrivate] = useState(true);
  const [endDate, setEndDate] = useState('');

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validateForm = () => {
    if (!question.trim()) return false;
    if (options.some((opt) => !opt.trim())) return false;
    if (!endDate) return false;
    if (new Date(endDate) <= new Date()) return false;

    // Validate text length and ASCII characters
    if (question.length > 31 || !/^[\x00-\x7F]*$/.test(question)) {
      alert(
        'Question must be 31 characters or less and contain only ASCII characters'
      );
      return false;
    }

    for (const option of options) {
      if (option.length > 31 || !/^[\x00-\x7F]*$/.test(option)) {
        alert(
          'Each option must be 31 characters or less and contain only ASCII characters'
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    if (!contract || !address) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      const success = await createPoll(question, options, endDate, isPrivate);

      if (success) {
        // Reset form
        setQuestion('');
        setOptions(['', '']);
        setIsPrivate(true);
        setEndDate('');
      }
    } catch (err) {
      console.error('Error creating poll:', err);
      setError(err instanceof Error ? err.message : 'Failed to create poll');
    }
  };

  // Calculate minimum date-time for the end date (current time + 1 hour)
  const minDateTime = new Date();
  minDateTime.setHours(minDateTime.getHours() + 1);
  const minDateTimeString = minDateTime.toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What is your question? (max 31 chars)"
          required
          maxLength={31}
          className="bg-background text-foreground"
        />
        <p className="text-sm text-muted-foreground">
          {question.length}/31 characters
        </p>
      </div>

      <div className="space-y-4">
        <Label>Options (2-5)</Label>
        {options.map((option, index) => (
          <div key={index} className="flex space-x-2">
            <div className="flex-1 space-y-1">
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1} (max 31 chars)`}
                required
                maxLength={31}
                className="bg-background text-foreground"
              />
              <p className="text-sm text-muted-foreground">
                {option.length}/31 characters
              </p>
            </div>
            {options.length > 2 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeOption(index)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {options.length < 5 && (
          <Button
            type="button"
            variant="outline"
            onClick={addOption}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={minDateTimeString}
          required
          className="bg-background text-foreground"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="private"
          checked={isPrivate}
          onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
        />
        <Label htmlFor="private">Enable Privacy Mode (Calimero Network)</Label>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!address || isSubmitting || !validateForm()}
      >
        {isSubmitting ? 'Creating...' : 'Create Poll'}
      </Button>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </form>
  );
}
