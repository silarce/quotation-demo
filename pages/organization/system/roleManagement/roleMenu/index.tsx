import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import DataEntry from 'components/global/gear/dataEntry';
import SaveButton from 'components/global/myCom/button/SaveButton';
import CustomSelect from 'components/page/organization/system/usres/CustomSelect';
import SideMenu from 'components/page/organization/system/roleManagement/roleMenu/sideMenu';
import PermissionTable from 'components/page/organization/system/roleManagement/roleMenu/PermissionTable';
import type { MenuItem } from 'components/page/organization/system/roleManagement/roleMenu/type';
import {
  getRoleMenuPermission,
  saveRolePermission,
} from 'components/page/organization/system/roleManagement/roleMenu/api';
import { getRoleList } from 'components/page/organization/system/roleManagement/api_role';

export default function RolePermissionPage() {
  // 所有角色清單
  const [roleList, setRoleList] = useState<any[]>([]);
  // 被選擇的角色 ID
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  // API 回傳的完整選單權限資料（包含所有層級）
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  // 被選擇的第二層模組（用來顯示對應的第三層功能）
  const [selectedLevel2, setSelectedLevel2] = useState<MenuItem | null>(null);
  // 被修改過的第三層權限列表
  const [editedMenus, setEditedMenus] = useState<MenuItem[]>([]);

  // 建立角色選擇器下拉選項
  const roleOptions = useMemo(
    () => [
      { value: '', label: '請選擇' },
      ...roleList.map((role) => ({
        value: role.role_id,
        label: role.role_name,
      })),
    ],
    [roleList]
  );

  // 根據選到的第二層選單顯示該模組下的第三層功能
  const level3Children = useMemo(() => {
    return (menuData ?? []).filter((item) => item.level === 3 && item.parent_menu_id === selectedLevel2?.menu_id);
  }, [selectedLevel2, menuData]);

  const getMergedLevel3Children = () => {
    return level3Children.map((item) => {
      const edited = editedMenus.find((e) => e.menu_id === item.menu_id);

      return edited ?? item;
    });
  };

  useEffect(() => {
    getRoleList().then(setRoleList);
  }, []);

  useEffect(() => {
    if (!selectedRoleId) {
      setMenuData([]);
      setSelectedLevel2(null);
      setEditedMenus([]);

      return;
    }

    getRoleMenuPermission(selectedRoleId).then((res) => {
      setMenuData(res.data);
      setSelectedLevel2(null);
    });
  }, [selectedRoleId]);

  const handleSave = async () => {
    if (!selectedRoleId) {
      return;
    }

    const fe_menu_permission = editedMenus.map((menu) => ({
      menu_id: menu.menu_id,
      fe_enable_function_id_list: menu.function_list?.filter((f) => f.is_enable).map((f) => f.function_id) ?? [],
    }));

    try {
      await saveRolePermission({ role_id: selectedRoleId, fe_menu_permission });
      alert('儲存成功');

      const res = await getRoleMenuPermission(selectedRoleId);
      setMenuData(res.data);
      setSelectedLevel2(null);
      setEditedMenus([]);
    } catch (err) {
      console.error(err);
      alert('儲存失敗');
    }
  };

  return (
    <div className="border border-[#616161] rounded-md px-6 py-8 mt-1">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <label className="font-semibold mr-2 whitespace-nowrap">選擇角色：</label>
          <div className="w-[150px]">
            <CustomSelect
              options={roleOptions}
              value={roleOptions.find((opt) => opt.value === selectedRoleId) || null}
              onChange={(opt) => setSelectedRoleId(opt.value)}
            />
          </div>
        </div>
        <SaveButton label="儲存" className="h-[40px]" onClick={handleSave} />
      </div>

      <div className="flex gap-6 min-h-[300px]">
        <SideMenu data={menuData} onLevel2Click={setSelectedLevel2} />
        <div className="flex-1">
          {selectedLevel2 ? (
            <PermissionTable
              data={getMergedLevel3Children()}
              onChange={(updated) => {
                setEditedMenus((prev) => {
                  const updatedIds = updated.map((u) => u.menu_id);
                  // 移除舊的，再合併新的
                  const filtered = prev.filter((item) => !updatedIds.includes(item.menu_id));

                  return [...filtered, ...updated];
                });
              }}
            />
          ) : (
            <div className="text-gray-500">請選擇左側功能模組</div>
          )}
        </div>
      </div>
    </div>
  );
}
