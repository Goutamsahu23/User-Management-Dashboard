"use client";

import * as Dialog from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: { id?: number; name?: string; email?: string; phone?: string; company?: { name?: string } };
  onSubmit: (vals: { name: string; email: string; phone?: string; company?: string }) => void;
  submitting?: boolean;
};

export default function UserDialog({ open, onOpenChange, initial, onSubmit, submitting }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [company, setCompany] = useState(initial?.company?.name ?? "");

  useEffect(() => {
    setName(initial?.name ?? "");
    setEmail(initial?.email ?? "");
    setPhone(initial?.phone ?? "");
    setCompany(initial?.company?.name ?? "");
  }, [initial]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone, company });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 bg-[var(--surface)] rounded-md">
          <Dialog.Title className="text-lg font-semibold text-[var(--text)]">{initial ? "Edit User" : "Add User"}</Dialog.Title>

          <form onSubmit={handleSave} className="mt-4 space-y-5">

            {/* Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[var(--muted)]">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
        w-full px-4 py-2.5 rounded-lg border
        bg-white/70 dark:bg-[var(--surface)]
        border-black/10 dark:border-white/10
        text-[var(--text)]
        focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20
        transition shadow-sm
      "
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[var(--muted)]">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
        w-full px-4 py-2.5 rounded-lg border
        bg-white/70 dark:bg-[var(--surface)]
        border-black/10 dark:border-white/10
        text-[var(--text)]
        focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20
        transition shadow-sm
      "
                placeholder="example@email.com"
                type="email"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[var(--muted)]">
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="
        w-full px-4 py-2.5 rounded-lg border
        bg-white/70 dark:bg-[var(--surface)]
        border-black/10 dark:border-white/10
        text-[var(--text)]
        focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20
        transition shadow-sm
      "
                placeholder="+91 9876543210"
              />
            </div>

            {/* Company */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[var(--muted)]">
                Company
              </label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="
        w-full px-4 py-2.5 rounded-lg border
        bg-white/70 dark:bg-[var(--surface)]
        border-black/10 dark:border-white/10
        text-[var(--text)]
        focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20
        transition shadow-sm
      "
                placeholder="Company name"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="
          px-4 py-2 rounded-lg
          border border-black/10 dark:border-white/10
          bg-white/60 dark:bg-white/10
          text-[var(--text)]
          hover:bg-white/80 hover:-translate-y-[1px]
          transition
        "
                >
                  Cancel
                </Button>

              </Dialog.Close>

              <Button
                variant="primary"
                type="submit"
                disabled={submitting}
                className="
        px-5 py-2.5 rounded-lg text-white font-semibold
        bg-[var(--primary)] hover:bg-[var(--primary-dark)]
        shadow-md hover:shadow-lg hover:-translate-y-[1px]
        transition
      "
              >
                {submitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
