import api from "../lib/api";

export type UserPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: { name?: string } | string;
  address?: {
    street?: string;
    city?: string;
    zipcode?: string;
  };
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: { name?: string };
  address?: {
    street?: string;
    city?: string;
    zipcode?: string;
  };
};

export const createUser = async (payload: Partial<UserPayload>): Promise<User> => {
  const { data } = await api.post<User>("/users", payload);
  return data;
};

export const updateUser = async (id: number, payload: Partial<UserPayload>): Promise<User> => {
  const { data } = await api.put<User>(`/users/${id}`, payload);
  return data;
};


export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};