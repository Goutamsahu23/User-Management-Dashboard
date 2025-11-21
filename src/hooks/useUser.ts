"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import api from "@/lib/api";

export type UserDetail = {
  id: number;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  website?: string;
  company?: {
    name?: string;
    catchPhrase?: string;
    bs?: string;
  };
  address?: {
    street?: string;
    suite?: string;
    city?: string;
    zipcode?: string;
    geo?: { lat?: string; lng?: string };
  };
};

async function fetchUserById(id: string): Promise<UserDetail> {

  const res = await api.get<UserDetail>(`users/${id}`);
  return res.data;
}


export function useUser(id?: string | number | string[] | null) {
  const queryClient = useQueryClient();

  // normalize id: if it's an array, take the first element
  const idStr = (() => {
    if (id === undefined || id === null) return undefined;
    if (typeof id === "number") return String(id);
    if (Array.isArray(id)) return id.length > 0 ? id[0] : undefined;
    return id; // string
  })();

  const parsedNum = idStr !== undefined ? Number(idStr) : NaN;
  const isTempId = !isNaN(parsedNum) && parsedNum < 0;

  return useQuery<UserDetail, Error>({
    queryKey: ["user", idStr],

    queryFn: async () => {
      if (!idStr) throw new Error("Missing id");
      if (isTempId) {
        const cachedUsers = (queryClient.getQueryData<UserDetail[]>(["users"]) ?? []) as UserDetail[];
        const found = cachedUsers.find((u) => u.id === parsedNum);
        if (found) {
          return found;
        }

      }
      // normal server fetch for real ids or when cache miss for temp id
      return fetchUserById(idStr);
    },
    enabled: Boolean(idStr),
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}
