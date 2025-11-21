"use client";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import {User} from "@/lib/users.api";

async function fetchUsers(): Promise<User[]> {
  const res = await api.get<User[]>(`/users`);
  return res.data;
}


export function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 2,
    // cacheTime: 1000 * 60 * 10,
  });
}
