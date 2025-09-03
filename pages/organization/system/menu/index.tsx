const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;
import React, { useEffect, useState, useCallback } from 'react';
import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';
import { v4 as uuidv4 } from 'uuid';

import MenuTree from 'components/page/organization/system/menu/MenuTree';
import MenuEditor from 'components/page/organization/system/menu/MenuEditor';

//api
import { getMenuList, getMenuPaths } from 'components/page/organization/system/menu/api_menu';
import Btn from 'components/global/gear/button/btn_fong';
import { useNavStore } from 'components/page/organization/system/menu/navStore';
import axios from 'js/api/axiosCreator/axiosInstance';
import { MenuState } from 'components/page/organization/system/menu/type';
import { buildTree } from 'components/page/organization/system/menu/utils_menu';

const getAuthHeader = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('access_token');
  const type = localStorage.getItem('token_type') || 'Bearer';

  return token ? { Authorization: `${type} ${token}` } : {};
};

// 選單資料結構型別

export default function SettingMenu() {
  const { sideNav, setSideNav } = useNavStore();

  // 編輯/新增表單狀態
  const [state, setState] = useState({
    expandedMap: {},
    editId: null as string | null,
    inputName: '',
    inputUrl: '',
    inputOrder: '',
    iconFile: null as File | null,
    previewIconUrl: undefined as string | undefined,
    isEnable: true,
    editParentId: 'root',
    newParentId: 'root',
  });
  // 產生新的 UUID（用於新增選單 ID）
  const generateId = useCallback(() => uuidv4(), []);

  // 取得選單 API 並轉為樹狀
  const fetchMenu = async () => {
    try {
      const res = await getMenuList();

      if (res?.data) {
        setSideNav(buildTree(res.data));
      }
    } catch (err) {
      console.error('取得選單失敗', err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const header: MapPageHeader = {
    title: [
      {
        name: 'menuButtonManagement',
        className: 'bg-[#F5F5F5] !border-b-[1px] border-b-[#14256A] shadow-[inset_0_1px_4px_rgba(0,0,0,0.25)]',
      },
    ],
  };

  //管理MenuEditor所屬選單狀態
  const [menuPathOptions, setMenuPathOptions] = useState([]);

  const fetchMenuPaths = async () => {
    try {
      const res = await getMenuPaths();

      if (res.data?.returnCode === 0 && Array.isArray(res.data.data)) {
        setMenuPathOptions(res.data.data);
      }
    } catch (error) {
      console.error('取得選單路徑失敗', error);
    }
  };

  useEffect(() => {
    fetchMenuPaths();
  }, []);

  // 新增選單
  const handleCreateMenu = async () => {
    try {
      const formData = new FormData();

      // 將每個欄位都分別 append 進 formData
      formData.append('menu_name', state.inputName.trim());
      formData.append('menu_url', state.inputUrl || '');
      formData.append('display_order', state.inputOrder || '');
      formData.append('is_enable', state.isEnable.toString());
      formData.append('parent_menu_id', state.newParentId === 'root' ? '' : state.newParentId);

      if (state.iconFile) {
        formData.append('menuIconFile', state.iconFile); // ← 對應 Postman 的 key
      }

      await axios.post(`${BASE_URL}/api/v1/sys/menu`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeader() },
      });

      await fetchMenu();

      // 成功後重置
      setState((prev: MenuState) => ({
        ...prev,
        inputName: '',
        inputUrl: '',
        inputOrder: '',
        iconFile: null,
        isEnable: true,
        newParentId: 'root',
        previewIconUrl: undefined,
      }));

      fetchMenu();
      fetchMenuPaths();
    } catch (error) {
      console.error('新增選單失敗', error);
    }
  };

  // 處理儲存（更新）選單
  const handleSaveMenu = async () => {
    try {
      const formData = new FormData();

      formData.append('menu_name', state.inputName.trim());
      formData.append('menu_url', state.inputUrl || '');
      formData.append('display_order', state.inputOrder || '');
      formData.append('is_enable', state.isEnable.toString());
      formData.append('parent_menu_id', state.editParentId === 'root' ? '' : state.editParentId);

      if (state.iconFile) {
        formData.append('menuIconFile', state.iconFile); // 與新增相同的 key
      }

      await axios.post(`${BASE_URL}/api/v1/sys/menu/${state.editId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeader() },
      });

      await fetchMenu();

      setState((prev: MenuState) => ({
        ...prev,
        editId: null,
        inputName: '',
        inputUrl: '',
        inputOrder: '',
        iconFile: null,
        isEnable: true,
        editParentId: 'root',
        previewIconUrl: undefined,
        newParentId: '', // ← 一定給 string
      }));

      fetchMenu();
      fetchMenuPaths();
    } catch (error) {
      console.error('儲存選單失敗', error);
    }
  };

  // 判斷是否可以新增
  const canCreate =
    state.inputName.trim() !== '' &&
    (state.editId ? state.editParentId : state.newParentId).trim() !== '' &&
    state.inputUrl.trim() !== '' &&
    state.inputOrder.trim() !== '';

  //================================================================

  return (
    <>
      <PageHeader {...header} />
      <div className="px-6 py-8 border border-[#616161] rounded-md">
        <div className="flex gap-4 justify-end">
          <Btn
            theme="trash"
            onClick={() =>
              setState((prev: MenuState) => ({
                ...prev,
                editId: null,
                inputName: '',
                inputUrl: '',
                inputOrder: '',
                iconFile: null,
                isEnable: true,
                editParentId: 'root',
                previewIconUrl: undefined,
                newParentId: '',
              }))
            }
          >
            清除
          </Btn>

          {state.editId ? (
            <Btn theme="save" onClick={handleSaveMenu}>
              儲存
            </Btn>
          ) : (
            <Btn
              theme="add"
              onClick={handleCreateMenu}
              disabled={!canCreate}
              className={!canCreate ? '!bg-[#E0E0E0] !border-[#BDBDBD] !text-[#9E9E9E] !pointer-events-none' : ''}
            >
              新增模組
            </Btn>
          )}
        </div>
        <div className="flex gap-8 mt-6">
          <MenuTree
            menuData={sideNav}
            setMenuData={setSideNav}
            state={state}
            setState={setState}
            refetchMenuPaths={fetchMenuPaths}
          />
          <MenuEditor
            menuData={sideNav}
            setMenuData={setSideNav}
            state={state}
            setState={setState}
            generateId={generateId}
            replace={fetchMenu}
            menuPathOptions={menuPathOptions}
            refetchMenuPaths={fetchMenuPaths}
          />
        </div>
      </div>
    </>
  );
}
