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
        "overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 active:shadow-md active:translate-y-0", // Enhanced rounding, shadow, and hover effects
        className
      )}
      onClick={onClick} // Make the whole card clickable
    >
      <CardContent className="flex cursor-pointer flex-col items-center justify-center p-5 text-center"> {/* Increased padding */}
        {/* Icon Circle - Updated Style */}
        <div className="mb-4 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-gradient-to-br from-secondary via-secondary/80 to-secondary text-secondary-foreground shadow-md"> {/* Slightly larger, gradient bg, shadow */}
          {Icon ? (
            <Icon className="h-7 w-7" /> // Render icon if provided, slightly larger
          ) : (
            <span className="text-sm font-semibold">{iconText}</span> // Fallback text, added font-semibold
          )}
        </div>

        {/* Title Button - Updated Style */}
        <Button
          variant="default"
          className="h-auto rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:bg-accent active:text-accent-foreground active:shadow-inner" // Adjusted padding, hover/active effects
          // Removed onClick from Button, handled by Card onClick
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
