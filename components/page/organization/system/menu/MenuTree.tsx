const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;
import React from 'react';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import Image from 'next/image';
import axios from 'js/api/axiosCreator/axiosInstance';

import { MenuItem } from './type';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import { modal_delete } from 'components/global/gear/modal/fongModal';
import { MenuState } from './type';

// import scss from './menuTree.module.scss';

import { fetchHeaderNav, fetchSideNav } from './api';
import { useNavStore } from 'hooks/globalState/useGlobal_navStore';

const getAuthHeader = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('access_token');
  const type = localStorage.getItem('token_type') || 'Bearer';

  return token ? { Authorization: `${type} ${token}` } : {};
};

interface Props {
  menuData: MenuItem[];
  setMenuData: (menus: MenuItem[]) => void;
  state: MenuState;
  setState: React.Dispatch<React.SetStateAction<MenuState>>;
  refetchMenuPaths: () => void;
}

const MenuTree: React.FC<Props> = ({ menuData, setMenuData, state, setState, refetchMenuPaths }) => {
  // 切換展開狀態
  const toggleExpand = (id: string) => {
    setState((prev: MenuState) => ({
      ...prev,
      expandedMap: {
        ...prev.expandedMap,
        [id]: !prev.expandedMap[id],
      },
    }));
  };

  // 尋找目標節點的父節點 ID
  const findParentId = (items: MenuItem[], targetId: string, parentId: string | null = null): string | null => {
    for (const item of items) {
      if (item.menu_id === targetId) {
        return parentId;
      }

      if (item.children) {
        const found = findParentId(item.children, targetId, item.menu_id);

        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  // 從資料中刪除目標節點
  const deleteNode = (items: MenuItem[], targetId: string): MenuItem[] => {
    return items.flatMap((item) => {
      if (item.menu_id === targetId) {
        return [];
      }

      const newChildren = item.children ? deleteNode(item.children, targetId) : [];

      return [{ ...item, children: newChildren }];
    });
  };

  // 刪除功能
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/v1/sys/menu`, {
        params: { menu_id: id },
        data: { menu_id: id },
        headers: { ...getAuthHeader() },
      });

      await fetchHeaderNav().then((newNav) => {
        useNavStore.getState().setHeaderNav(newNav);
      });
      const currentHeaderId = useNavStore.getState().selectedHeaderId;

      if (currentHeaderId) {
        await fetchSideNav(currentHeaderId).then((newSideNav) => {
          useNavStore.getState().setSideNav(newSideNav);
        });
      }

      if (response.data.returnCode === 0) {
        const newData = deleteNode(menuData, id);
        setMenuData(newData);

        if (state.editId === id) {
          setState((prev: MenuState) => ({
            ...prev,
            editId: null,
            inputName: '',
            inputUrl: '',
            isEnable: true,
            editParentId: 'root',
            inputOrder: '',
          }));
        }

        refetchMenuPaths();
      } else {
        return;
      }
    } catch (error) {
      console.error('刪除API錯誤', error);
    }
  };

  // 遞迴渲染選單節點
  const renderMenu = (items: MenuItem[], level: number = 0) => (
    <ul className="w-full">
      {items.map((item) => {
        const hasChildren = (item.children ?? []).length > 0;
        const expanded = state.expandedMap[item.menu_id];

        return (
          <li key={item.menu_id} className="w-full">
            <div
              className={`flex justify-between items-center w-full px-3 py-1 hover:bg-gray-50 ${
                level === 2 ? 'h-[40px]' : 'h-[48px]'
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <div style={{ marginLeft: `${level * 16}px` }} className="flex items-center gap-2">
                  <span className="font-medium text-[14px]">{item.menu_name}</span>
                  {hasChildren && (
                    <button
                      onClick={() => toggleExpand(item.menu_id)}
                      className="text-sm w-4 h-4 flex items-center justify-center hover:bg-gray-200 rounded"
                    >
                      {expanded ? <DownOutlined /> : <RightOutlined />}
                    </button>
                  )}
                </div>
              </div>
              {/* 編輯與刪除按鈕 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className="p-1 hover:bg-blue-100 rounded"
                  onClick={() => {
                    const parentId = findParentId(menuData, item.menu_id) ?? 'root';

                    const fetchPreviewIcon = async () => {
                      if (!item.menu_icon_path) {
                        return undefined;
                      }

                      try {
                        const res = await fetch(`${BASE_URL}/api/v1/sys/file/download/${item.menu_icon_path}`, {
                          headers: { ...getAuthHeader },
                        });
                        const blob = await res.blob();

                        // 包成 File
                        return new File([blob], item.menu_icon_path, { type: blob.type });
                      } catch (err) {
                        console.error('圖片下載失敗', err);

                        return undefined;
                      }
                    };

                    fetchPreviewIcon().then((file) => {
                      setState(
                        (prev: MenuState): MenuState => ({
                          ...prev,
                          editId: item.menu_id,
                          inputName: item.menu_name,
                          editParentId: parentId,
                          inputUrl: item.menu_url ?? '',
                          isEnable: item.is_enable ?? true,
                          inputOrder: item.display_order ?? '',
                          iconFile: file ?? null, // 這裡直接存 File
                          previewIconUrl: file ? URL.createObjectURL(file) : undefined,
                        })
                      );
                    });
                  }}
                >
                  <Image src={editIcon} alt="Edit" width={16} height={16} />
                </button>
                <button
                  className="p-1 hover:bg-red-100 rounded"
                  onClick={() => {
                    modal_delete({
                      title: '確認刪除嗎？',
                      onConfirm: () => handleDelete(item.menu_id), // 直接用 item.menu_id
                    });
                  }}
                >
                  <Image src={deleteIcon} alt="Delete" width={16} height={16} />
                </button>
              </div>
            </div>
            {/* 子節點遞迴渲染 */}
            {hasChildren && expanded && renderMenu(item.children!, level + 1)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="border rounded-md w-[20%] border-[#616161]">
      <h2 className="text-[16px] font-semibold p-3 bg-[#EDF1F7] rounded-t-md border-b border-[#212121]">模組選擇</h2>
      <div className="p-3 ">{renderMenu(menuData)}</div>
      {/* <Modal
        title=""
        width={258}
        closable={false}
        centered
        open={isModalOpen}
        className={scss.customModal}
        onOk={() => deleteTargetId && handleDelete(deleteTargetId)}
        okButtonProps={{ className: 'redButtonNew' }}
        okText={
          <div className="flex items-center gap-2">
            <Btn theme="trash"></Btn>
          </div>
        }
        onCancel={() => setIsModalOpen(false)}
        cancelButtonProps={{ className: 'cancelbutton' }}
        cancelText={<span className="flex items-center gap-2">取消</span>}
      >
        <div className="flex gap-2">
          <Image src={warning} alt="alert" />
          <span className="text-[20px] font-semibold">確認刪除嗎？</span>
        </div>
        <p className="mt-3 mb-6 font-medium">此操作將永久刪除，且無法復原。</p>
      </Modal> */}
    </div>
  );
};

export default MenuTree;
