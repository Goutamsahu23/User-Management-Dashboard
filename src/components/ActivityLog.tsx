// src/components/ActivityLog.tsx
"use client";

import React from "react";
import useStore, { Activity } from "@/stores/useStore";
import { format } from "date-fns";

function ActivityRow({ item }: { item: Activity }) {
  const ts = item.timestamp ? new Date(item.timestamp) : undefined;
  return (
    <div className="flex items-start gap-3 py-2 border-b last:border-b-0">
      <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-xs font-semibold text-[var(--primary)]">
        {item.type.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 text-sm">
        <div className="text-[var(--text)]">{item.message}</div>
        <div className="text-xs text-[var(--muted)] mt-0.5">
          {ts ? format(ts, "yyyy-MM-dd HH:mm:ss") : "-"}
        </div>
      </div>
    </div>
  );
}

export default function ActivityLog() {
  const activities = useStore((s) => s.activityLog);
  const clear = useStore((s) => s.clearActivities);

  return (
    <aside className="w-full md:w-80 bg-[var(--surface)] border-l p-4 card scrollbar-hide">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Activity Log</h3>
        <button onClick={() => clear()} className="text-xs px-2 py-1 border rounded">Clear</button>
        
      </div>

      {activities.length === 0 ? (
        <div className="text-sm text-[var(--muted)]">No activity yet.</div>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-[60vh] scrollbar-hide">
          {activities.map((a) => <ActivityRow key={a.id} item={a} />)}
        </div>
      )}
    </aside>
  );
}
