import { create } from 'zustand';
import type { HeaderMenuItem, NestedMenuItem } from './type';
interface NavStoreState {
  headerNav: HeaderMenuItem[];
  selectedHeaderId: string | null;
  sideNav: NestedMenuItem[];
  sideNavActiveHeaderIds: string[];
  setHeaderNav: (data: HeaderMenuItem[]) => void;
  setSelectedHeaderId: (id: string) => void;
  setSideNav: (data: NestedMenuItem[]) => void;
  setSideNavActiveHeaderIds: (ids: string[]) => void;
}

export const useNavStore = create<NavStoreState>((set) => ({
  headerNav: [],
  headerNavReady: false,
  selectedHeaderId: null,
  sideNav: [],
  sideNavActiveHeaderIds: [],
  setHeaderNav: (data) => set({ headerNav: data }),
  setSelectedHeaderId: (id) => set({ selectedHeaderId: id }),
  setSideNav: (data) => set({ sideNav: data }),
  setSideNavActiveHeaderIds: (ids) => set({ sideNavActiveHeaderIds: ids }),
}));
