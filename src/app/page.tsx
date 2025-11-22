"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import {User} from "@/lib/users.api"
import UserTable from "@/components/users/UserTable";
import UserDialog from "@/components/users/UserDialog";
import DeleteConfirm from "@/components/users/DeleteConfirm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser, deleteUser } from "@/lib/users.api";
import useStore from "@/stores/useStore";
import ActivityLog from "@/components/ActivityLog";
import Button from "@/components/ui/Button";
import CompanySelect from "@/components/ui/CompanySelect";
import EmailSortButton from "@/components/ui/EmailSort";
import { Search, Mail, ChevronDown, X } from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import api from "@/lib/api";
import * as Dialog from "@radix-ui/react-dialog";

export default function DashboardPage() {
  const { data: users, isLoading } = useUsers();
  const queryClient = useQueryClient();
  const addActivity = useStore((s) => s.addActivity);

  // store selectors for activity log UI
  const showActivityLog = useStore((s) => s.showActivityLog);
  const toggleShowActivityLog = useStore((s) => s.toggleShowActivityLog);

  // track whether viewport is mobile (below md)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 767px)");
    const onChange = (ev: MediaQueryListEvent | MediaQueryList) => setIsMobile(Boolean((ev as any).matches));
    setIsMobile(m.matches);
    if ("addEventListener" in m) {
      m.addEventListener("change", onChange as any);
      return () => m.removeEventListener("change", onChange as any);
    } else {
      // // fallback
      // m.addListener(onChange as any);
      // return () => m.removeListener(onChange as any);
    }
  }, []);

  // dialogs
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);

  // filters
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [emailSort, setEmailSort] = useState<"none" | "asc" | "desc">("none");

  // pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  //  companies for dropdown
  const companies = useMemo(() => {
    if (!users) return [];
    return Array.from(
      new Set(
        users.map((u) => u.company?.name?.trim() || "Unknown")
      )
    );
  }, [users]);

  // processed list
  const processed = useMemo(() => {
    if (!users) return [];
    let list = [...users];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q));
    }
    if (companyFilter !== "all") {
      list = list.filter((u) => (u.company?.name ?? "Unknown") === companyFilter);
    }
    if (emailSort === "asc") list.sort((a, b) => a.email.localeCompare(b.email));
    if (emailSort === "desc") list.sort((a, b) => b.email.localeCompare(a.email));

    return list;
  }, [users, search, companyFilter, emailSort]);

  const total = processed.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paged = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ---------------- CREATE MUTATION ---------------- */
  const createMut = useMutation({
    mutationFn: (vals: any) =>
      createUser({
        name: vals.name,
        email: vals.email,
        phone: vals.phone,
        company: { name: vals.company },
      }),

    onMutate: async (vals) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const prev = queryClient.getQueryData<User[]>(["users"]) ?? [];
      const tempId = -Date.now();
      const optimistic: User = {
        id: tempId,
        name: vals.name,
        email: vals.email,
        phone: vals.phone,
        company: { name: vals.company },
      };
      queryClient.setQueryData(["users"], (old: any = []) => [optimistic, ...old]);
      return { prev, tempId };
    },

    onError: (_e, _v, ctx: any) => {
      if (ctx?.prev) queryClient.setQueryData(["users"], ctx.prev);
    },

    onSuccess: (data, _vars, ctx: any) => {
      queryClient.setQueryData(["users"], (old: any = []) =>
        old.map((u: User) =>
          u.id === ctx.tempId
            ? {
              
              ...data,
              ...u, // local edits overwrite server fields if present
            }
            : u
        )
      );
      addActivity({ type: "add", message: `Added user ${data.name}` });
    },
  });

  /* ---------------- UPDATE MUTATION ---------------- */
  const updateMut = useMutation({
    mutationFn: async ({ id, vals }: any) => {
      
      if (id < 0) {
        // emulate server response using the temp id 
        return Promise.resolve({ id, name: vals.name, email: vals.email, phone: vals.phone, company: { name: vals.company } });
      }

      return updateUser(id, {
        name: vals.name,
        email: vals.email,
        phone: vals.phone,
        company: { name: vals.company },
      });
    },

    onMutate: async ({ id, vals }: any) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const prev = queryClient.getQueryData<User[]>(["users"]) ?? [];
      // update in cache
      queryClient.setQueryData(["users"], (old: any = []) =>
        old.map((u: User) =>
          u.id === id ? { ...u, name: vals.name, email: vals.email, phone: vals.phone, company: { name: vals.company } } : u
        )
      );
      return { prev };
    },

    onError: (_e, _v, ctx: any) => {
      if (ctx?.prev) queryClient.setQueryData(["users"], ctx.prev);
    },

    onSuccess: (data) => {
      
      queryClient.setQueryData(["users"], (old: any = []) =>
        // if server returned a new id & we have an old temp id entry, we will handle mapping in createMut.onSuccess
        old.map((u: User) => (u.id === data.id ? data : u))
      );
      addActivity({ type: "edit", message: `Edited user ${data.name}` });
    },
  });

  /* ---------------- DELETE MUTATION ---------------- */
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteUser(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const prev = queryClient.getQueryData<User[]>(["users"]) ?? [];
      queryClient.setQueryData(["users"], (old: any = []) => old.filter((u: User) => u.id !== id));
      return { prev };
    },

    onError: (_e, _v, ctx: any) => {
      if (ctx?.prev) queryClient.setQueryData(["users"], ctx.prev);
    },

    onSuccess: (_d, id) => {
      addActivity({ type: "delete", message: `Deleted user ${id}` });
    },
  });

  // open add
  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  // open edit
  const openEdit = (u: User) => {
    setEditing(u);
    setDialogOpen(true);
  };

  // submit form
  const handleSubmit = (vals: any) => {
    api
      .post("/api/users", vals)
      .then((res) => {
        console.log("Fake axios post request", res);
      })
      .catch((err) => {
        console.error("Fake axios post request failed, but continuing...", err);
      });
    editing ? updateMut.mutate({ id: editing.id, vals }) : createMut.mutate(vals);
    setDialogOpen(false);
  };

  // confirm delete
  const handleDelete = (u: User) => {
    setToDelete(u);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;

    api
      .delete(`/api/users/${toDelete.id}`)
      .then((res) => {
        console.log("Fake axios delete request", res);
      })
      .catch((err) => {
        console.error("Fake axios delete request failed, but continuing...", err);
      });

    deleteMut.mutate(toDelete.id);
    setDeleteOpen(false);
  };

  return (
    <div className="p-6 container">
      {/* ----------- FILTER BAR ------------ */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--muted)" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name..."
              className="
                w-full pl-10 pr-3 py-2.5 rounded-lg border
                bg-white/70 dark:bg-(--surface)
                border-black/10 dark:border-white/10
                text-(--text) text-sm
                focus:ring-4 focus:ring-(--primary)/20
              "
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* company select  */}
          <CompanySelect
            value={companyFilter}
            onChange={(v) => {
              setCompanyFilter(v);
              setPage(1);
            }}
            options={companies}
          />

          {/* email sort */}
          <EmailSortButton
            sort={emailSort}
            onChange={(v) => {
              setEmailSort(v);
              setPage(1);
            }}
          />
        </div>

        {/* add user */}
        <Button variant="primary" onClick={openAdd}>
          Add User
        </Button>
      </div>


      <div className="flex flex-col md:flex-row gap-6">
        {/* main table */}
        <div className="flex-1">
          <div className="card p-4">
            <UserTable users={paged} isLoading={isLoading} onEdit={openEdit} onDelete={handleDelete} />

            {/* pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-500">Showing {paged.length} of {total} users</div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 inline-flex items-center gap-1"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                <span className="text-sm">Page {page} / {pages}</span>

                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="px-3 py-1 border rounded disabled:opacity-50 inline-flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* activity log right side: hidden on small, visible on md+ */}
        {showActivityLog && (
          <>
            <div className="hidden md:block w-full md:w-80 fade-in-up">
              <ActivityLog />
            </div>

            {/* Mobile dialog using Radix Dialog - only mounted when viewport is mobile */}
            {isMobile && (
              <div className="md:hidden">
                <Dialog.Root open={showActivityLog} onOpenChange={toggleShowActivityLog}>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
                    <Dialog.Content className="fixed left-4 right-4 bottom-6 z-50 bg-(--surface) border border-(--border) rounded-lg p-4 max-h-[80vh] overflow-auto">

                      <div className="space-y-2">
                        <ActivityLog />
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            )}
          </>
        )}
      </div>

      {/* dialogs */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing ?? undefined}
        onSubmit={handleSubmit}
        submitting={Boolean((createMut as any)?.isLoading) || Boolean((updateMut as any)?.isLoading)}
      />

      <DeleteConfirm
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        userName={toDelete?.name}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
