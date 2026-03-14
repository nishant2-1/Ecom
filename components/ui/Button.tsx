"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  asChild?: boolean;
};

export function Button({ children, className, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-luxury-amber px-5 py-3 text-sm font-semibold text-luxury-amber transition hover:bg-luxury-amber hover:text-black",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
