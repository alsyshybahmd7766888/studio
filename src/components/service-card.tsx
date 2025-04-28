'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  iconText: string;
  buttonText: string;
  onClick?: () => void; // Optional onClick handler
}

export function ServiceCard({ iconText, buttonText, onClick }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl bg-card text-card-foreground shadow-md transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1 active:shadow-inner active:translate-y-0">
      <CardContent className="flex flex-col items-center justify-center p-4 text-center">
        {/* Icon Circle */}
        <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <span className="text-sm font-medium">{iconText}</span>
        </div>

        {/* Title Button */}
        <Button
          variant="default"
          className="h-auto rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground"
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
