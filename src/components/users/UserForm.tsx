// src/components/users/UserForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/hooks/useUsers";

type FormProps = {
  initial?: Partial<User>;
  onCancel: () => void;
  onSubmit: (values: { name: string; email: string; phone?: string; company?: string }) => void;
  isSubmitting?: boolean;
};

export default function UserForm({ initial, onCancel, onSubmit, isSubmitting }: FormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [company, setCompany] = useState(initial?.company?.name ?? "");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    setName(initial?.name ?? "");
    setEmail(initial?.email ?? "");
    setPhone(initial?.phone ?? "");
    setCompany(initial?.company?.name ?? "");
    setErrors({});
  }, [initial]);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) e.email = "Valid email is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (!validate()) return;
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim(), company: company.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded"
          placeholder="Full name"
        />
        {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded"
          placeholder="email@example.com"
        />
        {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded"
          placeholder="+1 234 567 890"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Company</label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded"
          placeholder="Company name"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 border rounded">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="px-3 py-2 bg-indigo-600 text-white rounded">
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
