'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card'; // Use Card for structure
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon?: LucideIcon;
  iconText?: string; // Text fallback for icon circle
  buttonText: string;
  onClick?: () => void;
  className?: string;
  isActive?: boolean; // For active state styling
}

export function ServiceCard({ icon: Icon, iconText, buttonText, onClick, className, isActive }: ServiceCardProps) {
  return (
    // Card: White background, rounded-xl (12px), light shadow
    <Card
      className={cn(
        "overflow-hidden rounded-xl bg-card text-card-foreground shadow-md transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5 active:shadow-sm active:translate-y-0", // Adjusted hover/active effect
        className
      )}
      onClick={onClick} // Click handler on the card
    >
      {/* Padding 12px (p-3), center content */}
      <CardContent className="flex cursor-pointer flex-col items-center justify-center p-3 text-center">
         {/* Icon Circle - Secondary color background (Dark Blue #004E66 in old theme, adapt if needed), White text/icon */}
        {/* Let's use a fixed secondary color for the icon circle for now if not defined in theme */}
        <div className="mb-3 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#004E66] text-white shadow-sm"> {/* Hardcoded dark blue example */}
          {Icon ? (
            <Icon className="h-6 w-6" /> // Render Lucide icon
          ) : (
            // Fallback text: White, simple font
            <span className="text-sm font-medium">{iconText}</span>
          )}
        </div>

        {/* Title Button - Primary color background (Dark Green), White text, rounded 8px */}
        <Button
          variant="default" // Use default variant which maps to primary
          className={cn(
            "h-auto rounded-[var(--radius)] px-3 py-1.5 text-center text-sm font-medium text-primary-foreground shadow-sm transition-colors duration-200", // Base styles: primary bg, white text, rounded 8px
             // Active state: Use Accent color (Orange)
             isActive ? "bg-[#FF6F3C] hover:bg-orange-500" : "bg-primary hover:bg-primary/90", // Primary default, Orange active
             "active:bg-[#FF6F3C]" // Always orange on active press
          )}
          // onClick is handled by the Card
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
