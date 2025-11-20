// src/stores/useStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** ----- Types ----- **/
export type SimpleUser = {
  id: number;
  name: string;
  email?: string;
};

export type ActivityType = "add" | "edit" | "delete" | "login" | "other";

export type Activity = {
  id: string; // timestamp or uuid string
  type: ActivityType;
  message: string;
  timestamp: string; // ISO string
};

type Store = {
  // state
  loggedInUser: SimpleUser | null;
  darkMode: boolean;
  activityLog: Activity[];

  // actions
  setLoggedInUser: (user: SimpleUser | null) => void;
  toggleDarkMode: () => void;
  setDarkMode: (val: boolean) => void;
  addActivity: (payload: { type: ActivityType; message: string }) => void;
  clearActivities: () => void;
};

/** ----- Default user (hardcoded) ----- **/
const DEFAULT_USER: SimpleUser = {
  id: 1,
  name: "Leanne Graham",
  email: "Sincere@april.biz",
};

/**
 * Create the store with persist middleware.
 */
export const useStore = create<Store>()(
  persist<Store>(
    (set, get) => ({
      // initial state
      loggedInUser: DEFAULT_USER,
      darkMode: false,
      activityLog: [],

      // actions
      setLoggedInUser: (user: SimpleUser | null) => {
        set({ loggedInUser: user });
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      setDarkMode: (val: boolean) => {
        set(() => ({ darkMode: val }));
      },

      addActivity: ({ type, message }: { type: ActivityType; message: string }) => {
        const id = `${Date.now()}`;
        const timestamp = new Date().toISOString();
        const activity: Activity = { id, type, message, timestamp };
        set((state) => ({ activityLog: [activity, ...state.activityLog] }));
      },

      clearActivities: () => {
        set({ activityLog: [] });
      },
    }),
    {
      name: "um-dashboard-store", 
    }
  )
);

export default useStore;
