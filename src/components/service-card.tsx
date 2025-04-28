'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon?: LucideIcon;
  iconText?: string;
  buttonText: string;
  onClick?: () => void;
  className?: string;
  isActive?: boolean; // To handle active state for button click
}

export function ServiceCard({ icon: Icon, iconText, buttonText, onClick, className, isActive }: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-xl bg-card text-card-foreground shadow-md transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1 active:shadow-sm active:translate-y-0", // White card, rounded-xl, subtle shadow & hover
        className
      )}
      onClick={onClick} // Make the whole card clickable
    >
      <CardContent className="flex cursor-pointer flex-col items-center justify-center p-5 text-center">
        {/* Icon Circle - Secondary background, white text/icon */}
        <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-sm"> {/* Dark Blue bg, White text */}
          {Icon ? (
            <Icon className="h-6 w-6" /> // Render icon if provided
          ) : (
            <span className="text-sm font-semibold">{iconText}</span> // Fallback text
          )}
        </div>

        {/* Title Button - Primary background, white text. Orange on active/click */}
        <Button
          variant="default"
          className={cn(
            "h-auto rounded-lg px-3 py-1.5 text-center text-sm font-medium text-primary-foreground shadow-sm transition-colors duration-200", // base styles
            isActive ? "bg-accent hover:bg-accent/90" : "bg-primary hover:bg-primary/90", // Teal default, Orange active
             "active:bg-accent" // Always orange on active press
          )}
          // onClick logic is handled by the Card's onClick
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
