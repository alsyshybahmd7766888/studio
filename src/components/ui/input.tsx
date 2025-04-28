import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles from specs: h-12 (48px), rounded-md (8px), border, bg-input (#F9F9F9), padding, text-base (16sp)
          "flex h-12 w-full rounded-[var(--radius)] border border-border bg-input px-3 py-2 text-base ring-offset-background",
          // File input specific styles (keep default)
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Placeholder text style: #9E9E9E (muted-foreground)
          "placeholder:text-muted-foreground",
          // Focus visible state: default ring
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Disabled state: default
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Ensure text color is appropriate for the background (usually card-foreground or foreground)
          "text-card-foreground", // Use card-foreground for text on light input bg
          // Remove responsive text size unless specified
          // "md:text-sm",
          // Transition for smooth visual changes
          "transition-colors duration-200 ease-in-out",
           // Remove hover effect unless specified
          // "hover:border-primary/50",
          className // Allow consuming components to override styles
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
