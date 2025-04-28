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

const topupOptions = [
  { value: 5, description: 'رصيد 5$' },
  { value: 10, description: 'رصيد 10$' },
  { value: 20, description: 'رصيد 20$' },
  { value: 50, description: 'رصيد 50$' },
];

export default function MobileTopupCard({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {topupOptions.map((option) => (
        <Button
          key={option.value}
          variant="outline"
          className="h-auto py-3 text-base"
          onClick={() => onSelect({ type: 'topup', ...option })}
        >
          {option.description}
        </Button>
      ))}
    </div>
  );
}
