import * as React from "react";

import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border border-input bg-transparent px-4 py-2 text-meta transition-colors duration-300 ease-soja file:border-0 file:bg-transparent file:text-meta file:text-foreground placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
