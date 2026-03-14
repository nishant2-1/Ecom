"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

type ModalProps = {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
};

export function Modal({ trigger, title, children }: ModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="glass-card fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6">
          <Dialog.Title className="text-luxury-heading text-2xl">{title}</Dialog.Title>
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
