import { create } from "zustand";

interface DebugStore {
  debug: boolean;
  setDebug: (debug: boolean) => void;
}

export const useDebugStore = create<DebugStore>((set) => ({
  debug: false,
  setDebug: (debug: boolean) => set({ debug }),
}));
