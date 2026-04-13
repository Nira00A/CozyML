import { create } from "zustand";

interface ActiveTab {
  activeTab: string;
  setActiveTab: (name: string) => void;
}

export const useActiveTabStore = create<ActiveTab>((set) => ({
  activeTab: "dashboard",
  setActiveTab: (name) => set((state) => ({ activeTab: name })),
}));
