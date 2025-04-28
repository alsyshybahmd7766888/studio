'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react'; // Import LucideIcon type
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon?: LucideIcon; // Optional icon component
  iconText?: string; // Keep text as fallback or alternative
  buttonText: string;
  onClick?: () => void;
  className?: string;
}

export function ServiceCard({ icon: Icon, iconText, buttonText, onClick, className }: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-xl bg-card text-card-foreground shadow-md transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5 active:shadow-inner active:translate-y-0", // Subtle hover/active effects
        className
      )}
      onClick={onClick} // Make the whole card clickable
    >
      <CardContent className="flex cursor-pointer flex-col items-center justify-center p-4 text-center">
        {/* Icon Circle */}
        <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          {Icon ? (
            <Icon className="h-6 w-6" /> // Render icon if provided
          ) : (
            <span className="text-sm font-medium">{iconText}</span> // Fallback text
          )}
        </div>

        {/* Title Button */}
        <Button
          variant="default"
          className="h-auto rounded-lg bg-primary px-3 py-1.5 text-center text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 active:bg-accent active:text-accent-foreground" // Adjusted hover/active colors
          // Removed onClick from Button, handled by Card onClick
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
