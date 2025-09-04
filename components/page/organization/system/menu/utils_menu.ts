// 將 API 平面資料轉為巢狀結構
import { FlatMenuItem, MenuItem } from './type';

export const buildTree = (flatList: FlatMenuItem[]): MenuItem[] => {
  const map = new Map<string, MenuItem>();
  const roots: MenuItem[] = [];

  flatList.forEach((item) => {
    map.set(item.menu_id, {
      menu_id: item.menu_id,
      parent_menu_id: item.parent_menu_id ?? undefined,
      menu_name: item.menu_name,
      menu_url: item.menu_url ?? undefined,
      is_enable: item.is_enable,
      display_order: item.display_order ?? '',
      level: typeof item.level === 'number' ? item.level : Number(item.level) || 1,
      path: item.menu_url ?? '',
      children: [],
      menu_icon_path: item.menu_icon_path ?? undefined,
    });
  });

  flatList.forEach((item) => {
    const node = map.get(item.menu_id)!;

    if (item.parent_menu_id && map.has(item.parent_menu_id)) {
      const parent = map.get(item.parent_menu_id)!;
      node.level = Number(parent.level ?? 0) + 1;
      parent.children?.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};
