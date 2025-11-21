"use client";

import React from "react";
import { Mail } from "lucide-react";

type Props = {
  sort: "none" | "asc" | "desc";
  onChange: (v: "none" | "asc" | "desc") => void;
  className?: string;
};

export default function EmailSortButton({ sort, onChange, className = "" }: Props) {
  const next = sort === "none" ? "asc" : sort === "asc" ? "desc" : "none";

  return (
    <button
      onClick={() => onChange(next)}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg border
        bg-white/60 dark:bg-[var(--surface)]
        border-black/10 dark:border-white/10
        text-sm text-[var(--text)]
        ${className}
      `}
      aria-pressed={sort !== "none"}
      title="Sort by email"
    >
      <Mail className="w-4 h-4" />
      {sort === "none" && <span className="text-[var(--muted)]">Email</span>}
      {sort === "asc" && <span>A → Z</span>}
      {sort === "desc" && <span>Z → A</span>}
    </button>
  );
}
