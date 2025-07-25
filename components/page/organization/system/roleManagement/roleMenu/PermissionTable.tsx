import React, { useEffect, useMemo, useState } from 'react';
import type { MenuItem } from './type';
import scss from './table.module.scss';
import { produce } from 'immer';

interface Props {
  data: MenuItem[];
  onChange: (updated: MenuItem[]) => void;
}

export default function PermissionTable({ data, onChange }: Props) {
  const [localData, setLocalData] = useState<MenuItem[]>([]);

  useEffect(() => {
    setLocalData(
      data.map((item) => ({
        ...item,
        function_list: item.function_list?.map((f) => ({ ...f })) ?? [],
      }))
    );
  }, [data]);

  // 回傳 localData 至父層
  useEffect(() => {
    if (localData.length > 0) {
      onChange(localData);
    }
  }, [JSON.stringify(localData)]); // 讓 shallow change 不會一直觸發

  // 所有功能名稱（表頭使用，從所有資料中提取不重複）
  const allFunctionNames = useMemo(() => {
    return Array.from(new Set(data.flatMap((d) => d.function_list?.map((f) => f.function_name)))).filter(
      Boolean
    ) as string[];
  }, [data]);

  // 切換某個功能是否啟用
  const togglePermission = (menuId: string, functionName: string, value: boolean) => {
    const updated = produce(localData, (draft) => {
      const menu = draft.find((m) => m.menu_id === menuId);
      const func = menu?.function_list?.find((f) => f.function_name === functionName);

      if (func) {
        func.is_enable = value;
      }
    });

    setLocalData(updated);
  };

  return (
    <div className="border border-[#616161] rounded-md overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="bg-[#EDF1F7] text-black">
            <th className="border-gray-400 px-4 py-3 text-left">表單</th>
            {allFunctionNames.map((fn) => (
              <th key={fn} className="border-gray-400 px-4 py-2 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span>{fn}</span>
                  <label className={scss.checkboxWrapperTable}>
                    <input
                      type="checkbox"
                      checked={localData.every((item) =>
                        item.function_list?.some((f) => f.function_name === fn && f.is_enable)
                      )}
                      onChange={(e) => {
                        const updated = produce(localData, (draft) => {
                          draft.forEach((menu) => {
                            const target = menu.function_list?.find((f) => f.function_name === fn);

                            if (target) {
                              target.is_enable = e.target.checked;
                            }
                          });
                        });
                        setLocalData(updated);
                      }}
                    />
                    <span className={scss.customCheckmarkTable}></span>
                  </label>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {localData.map((item) => (
            <tr key={item.menu_id} className="text-center">
              <td className="border-t border-[#616161] px-4 py-2 text-left">{item.menu_name}</td>

              {allFunctionNames.map((fn) => {
                const func = item.function_list?.find((f) => f.function_name === fn);
                const checked = func?.is_enable ?? false;

                return (
                  <td key={fn} className="border-t border-[#616161] px-4 py-2">
                    <label className={scss.checkboxWrapperTable}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => togglePermission(item.menu_id, fn, e.target.checked)}
                      />
                      <span className={scss.customCheckmarkTable}></span>
                    </label>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
