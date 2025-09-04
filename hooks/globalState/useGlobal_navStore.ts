import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MenuItem } from '../../components/page/organization/system/menu/type';
import { getMenuList } from 'js/api_menu/api_menu';
import { buildTree } from 'components/page/organization/system/menu/utils_menu';

export interface NavState {
  headerNav: any[];
  sideNav: MenuItem[];
  selectedHeaderId: string | null;
  setHeaderNav: (menus: any[]) => void;
  setSideNav: (menus: MenuItem[]) => void;
  setSelectedHeaderId: (id: string | null) => void;

  initSideNav: () => Promise<void>;
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

    //  初始化 SideNav
    initSideNav: async () => {
      try {
        const res = await getMenuList();

        if (res?.data) {
          set((state) => {
            state.sideNav = buildTree(res.data);
          });
        }
      } catch (err) {
        console.error('初始化 SideNav 失敗', err);
      }
    },
  }))
);
