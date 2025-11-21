
"use client";

import React from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { User } from "@/lib/users.api";
import Button from "@/components/ui/Button";
import { Edit, Trash2 } from "lucide-react";

type Props = {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export default function UserTable({ users, isLoading, onEdit, onDelete }: Props) {
  if (isLoading) return <div className="p-6">Loading users...</div>;
  if (!users || users.length === 0) return <div className="p-6">No users found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-sm text-[var(--muted)]">
            <th className="px-4 py-2">Avatar</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Company</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="table-row-hover transition-colors duration-150">
              <td className="px-4 py-3"><Avatar name={u.name} size={36} /></td>
              <td className="px-4 py-3">
                <Link href={`/users/${u.id}`} className="text-sm font-medium text-[var(--text)] hover:text-[var(--primary)]">
                  {u.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-[var(--muted)]">{u.email}</td>
              <td className="px-4 py-3 text-sm text-[var(--muted)]">{u.phone}</td>
              <td className="px-4 py-3 text-sm text-[var(--muted)]">{u.company?.name ?? "-"}</td>
              <td className="px-4 py-3 flex gap-2">
                <Button variant="ghost" leftIcon={<Edit size={14} />} onClick={() => onEdit(u)}>Edit</Button>
                <Button variant="danger" leftIcon={<Trash2 size={14} />} onClick={() => onDelete(u)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
