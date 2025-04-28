'use client';

import type * as React from 'react';
import { Button } from '@/components/ui/button';

type RechargeOption = {
  type: string;
  value: number;
  description: string;
};

type Props = {
  onSelect: (option: RechargeOption) => void;
};

const pubgOptions = [
  { value: 60, description: '60 شدة UC' },
  { value: 325, description: '325 شدة UC' },
  { value: 660, description: '660 شدة UC' },
  { value: 1800, description: '1800 شدة UC' },
];

export default function PubgCard({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {pubgOptions.map((option) => (
        <Button
          key={option.value}
          variant="outline"
          className="h-auto py-3 text-base"
          onClick={() => onSelect({ type: 'pubg', ...option })}
        >
          {option.description}
        </Button>
      ))}
    </div>
  );
}
