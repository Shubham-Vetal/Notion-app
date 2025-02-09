import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils"; // Ensure you have a utility function for classNames
import { VisuallyHidden } from "../VisuallyHidden"; // Assuming VisuallyHidden is in the same directory
import React from 'react'; // Ensure React is imported

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export function DialogTrigger({ children, ...props }) {
  return <DialogPrimitive.Trigger {...props}>{children}</DialogPrimitive.Trigger>;
}

export function DialogContent({ className, children, ...props }) {
  const hasTitle = React.Children.toArray(children).some(
    (child) => child.type === DialogTitle
  );

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl",
          className
        )}
        {...props}
      >
        {/* If no title exists, provide a hidden one */}
        {!hasTitle && (
          <DialogTitle>
            <VisuallyHidden>Default Dialog Title</VisuallyHidden>
          </DialogTitle>
        )}

        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}

export function DialogClose({ children, ...props }) {
  return (
    <DialogPrimitive.Close {...props} className="absolute top-2 right-2 p-2">
      <VisuallyHidden>Close</VisuallyHidden> {/* For accessibility */}
      <X className="h-5 w-5" />
    </DialogPrimitive.Close>
  );
}
