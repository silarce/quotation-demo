import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MenuItem } from './type';

export interface NavState {
  headerNav: any[];
  sideNav: MenuItem[];
  selectedHeaderId: string | null;
  setHeaderNav: (menus: any[]) => void;
  setSideNav: (menus: MenuItem[]) => void;
  setSelectedHeaderId: (id: string | null) => void;
}

export const useNavStore = create<NavState>()(
  immer((set) => ({
    headerNav: [],
    sideNav: [],
    selectedHeaderId: null,
    setHeaderNav: (menus) => {
      set((state) => {
        state.headerNav = menus;
      });
    },
    setSideNav: (menus) => {
      set((state) => {
        state.sideNav = menus;
      });
    },
    setSelectedHeaderId: (id) => {
      set((state) => {
        state.selectedHeaderId = id;
      });
    },
  }))
);
