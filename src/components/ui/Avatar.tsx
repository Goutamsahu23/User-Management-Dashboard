// src/components/ui/Avatar.tsx
"use client";
import React from "react";

export default function Avatar({ name, size = 40 }: { name?: string | null; size?: number }) {
  const initials = (name || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{ width: size, height: size, fontSize: Math.max(12, Math.floor(size / 2.5)) }}
      className="rounded-full flex items-center justify-center font-semibold text-white"
    >
      <div
        style={{
          width: size,
          height: size,
          fontSize: Math.max(12, Math.floor(size / 2.5)),
          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
        }}
        className="
        rounded-full flex items-center justify-center 
        font-semibold text-white select-none
        shadow-sm
      "
      >
        {initials}
      </div>
    </div>
  );
}
