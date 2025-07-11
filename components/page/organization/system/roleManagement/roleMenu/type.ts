export interface FunctionItem {
  function_id: string; // ← 加上這行
  function_name: string;
  is_enable: boolean;
  is_enable_comment?: string;
}

export interface MenuItem {
  menu_id: string;
  menu_name: string;
  parent_menu_id?: string;
  level: number;
  function_list?: FunctionItem[];
}
