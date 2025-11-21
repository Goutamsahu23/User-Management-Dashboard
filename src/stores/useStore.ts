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
  id: string; 
  type: ActivityType;
  message: string;
  timestamp: string; // ISO string
};

type Store = {
  // state
  loggedInUser: SimpleUser | null;
  darkMode: boolean;
  activityLog: Activity[];
  showActivityLog: boolean; // NEW

  // actions
  setLoggedInUser: (user: SimpleUser | null) => void;
  toggleDarkMode: () => void;
  setDarkMode: (val: boolean) => void;
  addActivity: (payload: { type: ActivityType; message: string }) => void;
  clearActivities: () => void;

  // activity log visibility
  setShowActivityLog: (val: boolean) => void;
  toggleShowActivityLog: () => void;
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
    (set) => ({
      // initial state
      loggedInUser: DEFAULT_USER,
      darkMode: false,
      activityLog: [],
      showActivityLog: true,

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

      // activity log visibility
      setShowActivityLog: (val: boolean) => {
        set({ showActivityLog: val });
      },

      toggleShowActivityLog: () => {
        set((state) => ({ showActivityLog: !state.showActivityLog }));
      },
    }),
    {
      name: "um-dashboard-store", // key in localStorage
    }
  )
);

export default useStore;
