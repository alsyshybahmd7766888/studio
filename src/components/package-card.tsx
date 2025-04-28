'use client';

import type * as React from 'react';
import { Button } from '@/components/ui/button';

type RechargeOption = {
  type: string;
  value: string;
  description: string;
};

type Props = {
  onSelect: (option: RechargeOption) => void;
};

const packageOptions = [
  { value: 'internet_1gb', description: 'باقة 1GB إنترنت' },
  { value: 'internet_5gb', description: 'باقة 5GB إنترنت' },
  { value: 'minutes_100', description: 'باقة 100 دقيقة' },
  { value: 'combo_basic', description: 'باقة كومبو الأساسية' },
];

export default function PackageCard({ onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {packageOptions.map((option) => (
        <Button
          key={option.value}
          variant="outline"
          className="h-auto py-3 text-base"
          onClick={() => onSelect({ type: 'package', ...option })}
        >
          {option.description}
        </Button>
      ))}
    </div>
  );
}
