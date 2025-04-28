import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles: flexible height, width, rounded corners, border, background, padding, text size/color
          "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-base ring-offset-background",
          // File input specific styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Placeholder text style
          "placeholder:text-muted-foreground",
          // Focus visible state: outline, ring effect
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Disabled state: cursor and opacity
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Responsive text size
          "md:text-sm",
          // Transition for smooth visual changes
          "transition-colors duration-200 ease-in-out",
           // Added hover effect for border
          "hover:border-primary/50",
          // Ensure background is card for better theme coherence
          "bg-card",
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
