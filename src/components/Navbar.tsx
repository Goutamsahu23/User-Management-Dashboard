"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import useStore from "@/stores/useStore";
import { List } from "lucide-react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import * as Switch from "@radix-ui/react-switch";

export default function Navbar() {
  const loggedInUser = useStore((s) => s.loggedInUser);
  const darkMode = useStore((s) => s.darkMode);
  const setDarkMode = useStore((s) => s.setDarkMode);
  const showActivityLog = useStore((s) => s.showActivityLog);
  const toggleShowActivityLog = useStore((s) => s.toggleShowActivityLog);
  const activityCount = useStore((s) => s.activityLog.length);

  return (
    <header className="w-full border-b px-4 sm:px-6 py-3 flex items-center justify-between bg-[var(--surface)]">
      {/* Left: Title */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-4 min-w-0">
        <h1
          className="text-base sm:text-lg font-semibold truncate"
          style={{ color: "var(--text)" }}
          title="User Management"
        >
          User Management
        </h1>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          leftIcon={<List size={16} />}
          onClick={toggleShowActivityLog}
          className="min-w-0"
        >

          <span className="hidden xs:inline sm:inline">Log</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--text)]">
            {activityCount}
          </span>
        </Button>

        {/* Dark mode switch */}
        <div className="flex items-center gap-2">
          <Switch.Root
            checked={darkMode}
            onCheckedChange={(v) => setDarkMode(Boolean(v))}
            aria-label="Toggle dark mode"
            className="
              relative w-15 h-7.5 rounded-full
              border border-black/10 dark:border-black/30
              bg-white/70 dark:bg-[rgba(255,255,255,0.08)]
              backdrop-blur
              transition-colors duration-300
              flex items-center
              px-1
            "
          >
            {/* Left icon (Sun) */}
            <SunIcon
              className={`
                w-4 h-4 absolute left-1
                transition-opacity duration-300
                ${darkMode ? "opacity-100" : "opacity-40"}
              `}
              style={{ color: "#FFD166" }}
            />

            {/* Right icon (Moon) */}
            <MoonIcon
              className={`
                w-4 h-4 absolute right-1
                transition-opacity duration-300
                ${darkMode ? "opacity-40" : "opacity-100"}
              `}
              style={{ color: "var(--primary-dark)" }}
            />

            {/* Thumb */}
            <Switch.Thumb
              className={`
                absolute top-0.5 left-0.5
                w-6 h-6 rounded-full
                bg-white dark:bg-[var(--surface)]
                shadow-md
                transition-transform duration-300 ease-out
                data-[state=unchecked]:translate-x-0
                data-[state=checked]:translate-x-7
              `}
            />
          </Switch.Root>
        </div>

        {/* user avatar + name */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar - keep displayed on all sizes */}
          <Avatar name={loggedInUser?.name} size={36} />

          {/* Username: hide on small screens */}
          <div
            className="hidden sm:block text-sm truncate"
            style={{ color: "var(--text)", maxWidth: 160 }}
            title={loggedInUser?.name}
          >
            {loggedInUser?.name}
          </div>
        </div>
      </div>
    </header>
  );
}
