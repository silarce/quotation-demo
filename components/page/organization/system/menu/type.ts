export interface MenuItem {
  level: number;
  path?: string;
  menu_icon_path?: string;
  menu_Id: string;
  com_Id: string;
  menu_Name: string;
  menu_Url?: string;
  menu_Icon?: string;
  display_Order: string;
  has_Function: boolean;
  is_Enable: boolean;
  created_By: string;
  created_At: string; // or Date
  updated_By: string;
  updated_At: string; // or Date
  deleted_At?: string; // 可選，因為有些項目沒有
  deleted_By?: string;
  is_Invalid: boolean;
  parent_Menu_Id?: string;
}

export interface NestedMenuItem extends MenuItem {
  children?: MenuItem[];
}

export interface HeaderMenuItem {
  level: number;
  path: string;
  menu_Id: string;
  com_Id: string;
  menu_Name: string;
  menu_Url?: string;
  menu_Icon?: string;
  display_Order: string;
  has_Function: boolean;
  is_Enable: boolean;
  created_By: string;
  created_At: string;
  updated_By: string;
  updated_At: string;
  deleted_At?: string;
  deleted_By?: string;
  is_Invalid: boolean;
}

export interface MenuState {
  expandedMap: Record<string, boolean>;
  editId: string | null;
  inputName: string;
  inputUrl: string;
  inputOrder: string;
  iconFile: File | null;
  isEnable: boolean;
  editParentId: string;
  previewIconUrl: string | undefined; // ← 改成必填，不是 ?
  newParentId: string;
}

export interface FlatMenuItem {
  menu_id: string;
  menu_name: string;
  menu_url?: string;
  display_order?: string;
  is_enable?: boolean;
  parent_menu_id?: string | null;
  menu_icon?: string;
  menu_icon_path?: string;
}
