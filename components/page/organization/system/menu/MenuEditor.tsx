import React from 'react';
import { Switch } from 'antd';
import { LogoUploader } from './menuUploader';
import { MenuNode } from 'pages/organization/system/menu/index';
import { MenuState } from './type';

import scss from './menuEditor.module.scss';

//DataEntry
import { DataEntry_fong, Input, Select } from 'components/global/gear/dataEntry';

interface MenuEditorProps {
  menuData: MenuNode[];
  setMenuData: React.Dispatch<React.SetStateAction<MenuNode[]>>;
  state: MenuState;
  setState: React.Dispatch<React.SetStateAction<MenuState>>;
  generateId: () => string;
  replace: () => void;
  refetchMenuPaths: () => void;
  menuPathOptions: { menu_id: string; menu_path: string }[];
}

const MenuEditor: React.FC<MenuEditorProps> = ({ state, setState, menuPathOptions }) => {
  return (
    <div className={`${scss.formBlock} border border-[#616161] rounded-lg p-6 w-[80%]`}>
      <div className="flex flex-col gap-5">
        <DataEntry_fong caption="模組名稱" isMust className="">
          <Input
            value={state.inputName}
            onChange={(e) => setState((prev: MenuState) => ({ ...prev, inputName: e.target.value }))}
          ></Input>
        </DataEntry_fong>
        <DataEntry_fong caption="所屬選單" isMust className="">
          <Select
            value={state.editId ? state.editParentId : state.newParentId}
            onChange={(value) =>
              setState((prev: MenuState) =>
                state.editId ? { ...prev, editParentId: value } : { ...prev, newParentId: value }
              )
            }
          >
            <option value="root">最上層</option>
            {menuPathOptions
              .filter((item) => item.menu_id !== state.editId)
              .map((item) => (
                <option key={item.menu_id} value={item.menu_id}>
                  {item.menu_path}
                </option>
              ))}
          </Select>
        </DataEntry_fong>
        <DataEntry_fong caption="選單路徑" isMust className="">
          <Input
            value={state.inputUrl}
            onChange={(e) => setState((prev: MenuState) => ({ ...prev, inputUrl: e.target.value }))}
          ></Input>
        </DataEntry_fong>
        <DataEntry_fong caption="顯示排序" isMust className="">
          <Input
            value={state.inputOrder}
            onChange={(e) => setState((prev: MenuState) => ({ ...prev, inputOrder: e.target.value }))}
          ></Input>
        </DataEntry_fong>
        <div className="">
          <LogoUploader
            iconFile={state.iconFile}
            setIconFile={(file) => setState((prev: MenuState) => ({ ...prev, iconFile: file }))}
            defaultPreviewUrl={state.previewIconUrl}
          />
        </div>
        <div className={` flex items-center justify-between`}>
          <div className="flex flex-col gap-2">
            <span className="font-bold">顯示前台</span>
            <Switch
              checked={state.isEnable}
              onChange={(checked) => setState((prev: MenuState) => ({ ...prev, isEnable: checked }))}
              className="w-[40px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuEditor;
