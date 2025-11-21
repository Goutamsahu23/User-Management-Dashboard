// src/components/users/DeleteConfirm.tsx
"use client";

import * as Alert from "@radix-ui/react-alert-dialog";
import RadixButton from "@/components/ui/Button"; // using plain Button
import React from "react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userName?: string;
  onConfirm: () => void;
};

export default function DeleteConfirm({ open, onOpenChange, userName, onConfirm }: Props) {
  return (
    <Alert.Root open={open} onOpenChange={onOpenChange}>
      <Alert.Portal>
        <Alert.Overlay className="fixed inset-0 bg-black/40" />
        <Alert.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--surface)] p-6 rounded-md shadow-lg w-full max-w-md">
          <Alert.Title className="text-lg font-semibold text-[var(--text)]">Confirm delete</Alert.Title>
          <Alert.Description className="mt-2 text-sm text-[var(--muted)]">
            Are you sure you want to delete <strong>{userName}</strong>? This action cannot be undone.
          </Alert.Description>

          <div className="mt-6 flex justify-end gap-3">
            <Alert.Cancel asChild>
              <button className="btn btn-ghost">Cancel</button>
            </Alert.Cancel>
            <Alert.Action asChild>
              <button onClick={() => onConfirm()} className="btn btn-danger">Delete</button>
            </Alert.Action>
          </div>
        </Alert.Content>
      </Alert.Portal>
    </Alert.Root>
  );
}
