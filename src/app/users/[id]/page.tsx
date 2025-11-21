
"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Avatar from "@/components/ui/Avatar";
import { Mail, Phone, Globe, Building, MapPin, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";


export default function UserDetailClient() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const { data: user, isLoading, isError } = useUser(id);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-600">Error loading user</div>;
  if (!user) return <div className="p-6">No user found</div>;



  return (
    <div className="p-6 container">
      {/* Header */}
      <div
        className="relative rounded-xl overflow-hidden mb-6"
        style={{
          background: "var(--gradient-surface)",
          border: "1px solid var(--border)",
        }}
      >


        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-5 md:p-6">

          {/* Avatar */}
          <div className="flex items-center gap-4 z-10 ">
            <Avatar name={user.name} size={72} />
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
                {user.name}
              </h2>
              <div className="mt-1 text-sm text-[var(--muted)]">{user.username ?? "member"}</div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: "var(--accent)", color: "var(--text)" }}
                >
                  User
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: "rgba(60,60,60,0.06)", color: "var(--muted)" }}
                >
                  ID: {user.id}
                </span>
              </div>
            </div>
          </div>

          {/* spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{ borderColor: "rgba(0,0,0,0.06)", background: "transparent", color: "var(--text)" }}
              aria-label="Back to list"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>

            <Button
              variant="primary"
              onClick={() => navigator.clipboard?.writeText(user.email ?? "")}
              className="px-3 py-2 rounded-lg hidden md:inline-flex"
              style={{
                background: "var(--primary)",
                color: "white",
                boxShadow: "0 8px 24px rgba(124,77,255,0.08)",
              }}
              aria-label="Copy email"
              title="Copy email"
            >
              Copy Email
            </Button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Contact & Company */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact card */}
          <section
            className="card p-5"
            style={{ display: "flex", gap: 16, alignItems: "flex-start", justifyContent: "space-between" }}
          >
            <div>
              <h3 className="text-lg font-medium mb-2" style={{ color: "var(--text)" }}>
                Contact
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className="p-2 rounded-md"
                    style={{ background: "rgba(124,77,255,0.06)", color: "var(--primary)" }}
                  >
                    <Mail className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-sm text-[var(--muted)]">Email</div>
                    <div className="text-sm" style={{ color: "var(--text)" }}>{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-md" style={{ background: "rgba(61,214,192,0.06)", color: "var(--secondary)" }}>
                    <Phone className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-sm text-[var(--muted)]">Phone</div>
                    <div className="text-sm" style={{ color: "var(--text)" }}>{user.phone ?? "-"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-md" style={{ background: "rgba(96,125,139,0.06)", color: "var(--muted)" }}>
                    <Globe className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-sm text-[var(--muted)]">Website</div>
                    <div className="text-sm" style={{ color: "var(--text)" }}>{user.website ?? "-"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* right side quick actions (small) */}
            <div className="hidden md:flex flex-col gap-2">
              <a
                href={`mailto:${user.email}`}
                className="px-3 py-2 rounded-lg text-sm text-[var(--text)] border"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                Email
              </a>
              <a
                href={`tel:${user.phone}`}
                className="px-3 py-2 rounded-lg text-sm text-[var(--text)] border"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                Call
              </a>
            </div>
          </section>

          {/* Company card */}
          <section className="card p-5">
            <h3 className="text-lg font-medium mb-3" style={{ color: "var(--text)" }}>
              Company
            </h3>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-md" style={{ background: "rgba(124,77,255,0.06)", color: "var(--primary)" }}>
                <Building className="w-5 h-5" />
              </div>

              <div>
                <div className="text-sm text-[var(--muted)]">Name</div>
                <div className="text-sm mb-2" style={{ color: "var(--text)" }}>{user.company?.name ?? "-"}</div>

                <div className="text-sm text-[var(--muted)]">Catchphrase</div>
                <div className="text-sm" style={{ color: "var(--text)" }}>{user.company?.catchPhrase ?? "-"}</div>
              </div>
            </div>
          </section>


        </div>

        {/* Right column: Address / Map */}
        <aside className="space-y-6">
          <section className="card p-4">
            <h3 className="text-lg font-medium mb-3" style={{ color: "var(--text)" }}>Address</h3>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md" style={{ background: "rgba(61,214,192,0.06)", color: "var(--secondary)" }}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-[var(--muted)]">Street</div>
                <div className="text-sm" style={{ color: "var(--text)" }}>
                  {user.address?.street ?? "-"} {user.address?.suite ?? ""}
                </div>

                <div className="mt-2 text-sm text-[var(--muted)]">City / Zip</div>
                <div className="text-sm" style={{ color: "var(--text)" }}>
                  {user.address?.city ?? "-"} • {user.address?.zipcode ?? "-"}
                </div>
              </div>
            </div>
          </section>


        </aside>
      </div>
    </div>
  );
}
