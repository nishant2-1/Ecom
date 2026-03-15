import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-luxury-amber/60 px-3 py-1 text-xs text-luxury-amber",
        className
      )}
    >
      {children}
    </span>
  );
}
