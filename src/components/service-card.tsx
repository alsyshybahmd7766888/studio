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
    // Card: Use card background, rounded-xl, shadow
    <Card
      className={cn(
        "overflow-hidden rounded-xl bg-card text-card-foreground shadow-md transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5 active:shadow-sm active:translate-y-0",
        className
      )}
      onClick={onClick} // Click handler on the card
    >
      {/* Padding 12px (p-3), center content */}
      <CardContent className="flex cursor-pointer flex-col items-center justify-center p-3 text-center">
         {/* Icon Circle - Use Secondary color background */}
        <div className={cn(
            "mb-3 flex h-[60px] w-[60px] items-center justify-center rounded-full shadow-sm",
             isActive ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground" // Use accent when active
        )}>
          {Icon ? (
            <Icon className="h-6 w-6" /> // Render Lucide icon
          ) : (
            // Fallback text: Use appropriate foreground color
            <span className={cn("text-sm font-medium", isActive ? "text-accent-foreground" : "text-secondary-foreground")}>{iconText}</span>
          )}
        </div>

        {/* Title Button - Primary color background, primary-foreground text, rounded */}
        <Button
          variant={isActive ? "accent" : "default"} // Use accent variant when active
          className={cn(
            "h-auto rounded-[var(--radius)] px-3 py-1.5 text-center text-sm font-medium shadow-sm transition-colors duration-200",
            isActive ? "bg-accent text-accent-foreground hover:bg-accent/90" : "bg-primary text-primary-foreground hover:bg-primary/90",
            "active:opacity-90" // Simple active feedback
          )}
          // onClick is handled by the Card
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}

// Add accent variant to buttonVariants if it doesn't exist
// You might need to update components/ui/button.tsx or extend variants here
import { cva } from "class-variance-authority"; // Assuming you use cva

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90", // Added Accent Variant
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Re-export Button component from ui/button if needed
// export { Button } from '@/components/ui/button';
