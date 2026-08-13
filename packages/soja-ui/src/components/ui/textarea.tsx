import * as React from "react";

import { cn } from "../../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[96px] w-full border border-input bg-transparent px-4 py-3 text-meta transition-colors duration-300 ease-soja placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
