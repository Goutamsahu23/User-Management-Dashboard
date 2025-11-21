"use client";

import React from "react";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
};

export default function CompanySelect({ value, onChange, options, placeholder = "All companies" }: Props) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="inline-flex items-center gap-2 px-3 py-2 border rounded text-sm bg-[var(--surface)]">
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="ml-2"><ChevronDownIcon /></Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="mt-2 w-56 rounded-md bg-[var(--surface)] border shadow-lg z-50"
        >
          <Select.Viewport className="p-1 max-h-48 overflow-y-auto">
            <Select.Item value="all" className="flex items-center justify-between px-2 py-2 rounded-sm hover:bg-gray-50">
              <Select.ItemText className="text-sm">All companies</Select.ItemText>
              {value === "all" && <CheckIcon />}
            </Select.Item>

            {options.map((opt) => (
              <Select.Item key={opt} value={opt} className="flex items-center justify-between px-2 py-2 rounded-sm hover:bg-gray-50 ">
                <Select.ItemText className="text-sm">{opt}</Select.ItemText>
                {value === opt && <CheckIcon />}
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
