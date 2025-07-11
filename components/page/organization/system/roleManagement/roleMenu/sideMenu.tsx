import { useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import classNames from 'classnames';

interface MenuItem {
  menu_id: string;
  parent_menu_id?: string;
  menu_name: string;
  level: number;
  children?: MenuItem[];
}

interface SideMenuProps {
  data: MenuItem[];
  onLevel2Click: (item: MenuItem) => void;
}

export default function SideMenu({ data, onLevel2Click }: SideMenuProps) {
  const level1 = (data ?? []).filter((d) => d.level === 1); // 最上層選單
  const level2 = (data ?? []).filter((d) => d.level === 2); // 第二層選單（功能模組）

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 切換展開收合狀態
  const toggleOpen = (menu_id: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [menu_id]: !prev[menu_id],
    }));
  };

  // 取得某個 level1 的子項目
  const getChildren = (parentId: string) => level2.filter((l2) => l2.parent_menu_id === parentId);

  return (
    <div className="w-[10%] border border-[#616161] rounded-md overflow-hidden">
      <div className="bg-[#EDF1F7] text-[16px] font-semibold px-4 py-3 border-b border-[#212121]">模組選擇</div>

      <div className="px-3 text-sm">
        {level1.map((l1) => {
          const children = getChildren(l1.menu_id);
          const isOpen = openMap[l1.menu_id] ?? false;

          return (
            <div key={l1.menu_id}>
              {/* 第一層標題 + 展開收合 */}
              <div
                className="flex gap-3 items-center justify-between cursor-pointer py-3 text-[16px]"
                onClick={() => toggleOpen(l1.menu_id)}
              >
                <span>{l1.menu_name}</span>
                {children.length > 0 &&
                  (isOpen ? <DownOutlined className="text-xs" /> : <RightOutlined className="text-xs" />)}
              </div>

              {/* 展開第二層選單 */}
              {isOpen &&
                children.map((l2) => (
                  <div
                    key={l2.menu_id}
                    className={classNames('flex items-center gap-1 py-1 cursor-pointer h-[40px]', {
                      'text-[#14256A]': selectedId === l2.menu_id,
                    })}
                    onClick={() => {
                      setSelectedId(l2.menu_id);
                      onLevel2Click(l2);
                    }}
                  >
                    <span className="text-sm">{selectedId === l2.menu_id ? '●' : '○'}</span>
                    <span className="text-[14px]">{l2.menu_name}</span>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
