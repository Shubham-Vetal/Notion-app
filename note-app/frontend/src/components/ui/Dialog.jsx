import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export function Dialog({ open, onOpenChange, children, title, description }) {
  const [hasTitle] = useState(!!title);
  const [hasDescription] = useState(!!description);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl`
          )}
          aria-labelledby={hasTitle ? "dialog-title" : undefined}
          aria-describedby={hasDescription ? "dialog-description" : undefined}
        >
          {/* Dialog Title */}
          {hasTitle && (
            <h2 id="dialog-title" className="text-lg font-semibold">
              {title}
            </h2>
          )}

          {/* Dialog Description */}
          {hasDescription && (
            <p id="dialog-description" className="text-sm text-gray-500 mb-4">
              {description}
            </p>
          )}

          {children}

          <DialogClose />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function DialogTrigger({ children, ...props }) {
  return <DialogPrimitive.Trigger {...props}>{children}</DialogPrimitive.Trigger>;
}

export function DialogClose({ children, ...props }) {
  return (
    <DialogPrimitive.Close {...props} className="absolute top-2 right-2 p-2">
      <span className="sr-only">Close</span>
      <X className="h-5 w-5" />
    </DialogPrimitive.Close>
  );
}

export function DialogContent({ children, className, ...props }) {
  return (
    <div className={cn("dialog-content", className)} {...props}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className }) {
  return <div className={cn("dialog-header", className)}>{children}</div>;
}

export function DialogTitle({ children, className, id = "dialog-title" }) {
  return <h2 id={id} className={cn("text-lg font-semibold", className)}>{children}</h2>;
}

export function DialogDescription({ children, className, id = "dialog-description" }) {
  return <p id={id} className={cn("text-sm text-gray-500 mb-4", className)}>{children}</p>;
}
