import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
// import { produce } from 'immer';
// import { useShallow } from 'zustand/react/shallow';

// 建立可以參考
// components/page/worksDepartment/worksheet/productForm/useWorksheet.ts
// 使用可以參考
// components/page/worksDepartment/worksheet/productForm/productForm.tsx
// 不過這兩個檔案都是第一次使用zustand的時候寫的，應該還有很多改進之處

type TvipInfo = {
  name?: string;
  title?: string;
  // idNumber: string;
  id: string;
};

type TvipList = {
  [title: string]: TvipInfo;
};

// 預期未來會用api取得這類固定審核人的資料，因此先作為
const useVipInfo = create<TvipList>()(
  immer((set, get) => ({
    //
    //
    //
    manager: {
      title: '總經理',
      id: '01f55698-49bb-4501-b432-1157a5109554',
    },
    worksDepartment_cashier: {
      name: '吳慧銀',
      title: '應收帳款', // 工務部應收帳款
      id: 'e9a6d2e4-1c76-4276-a747-2c7126e5593c',
    },
    worksDepartment_workSupervisor: {
      name: '鄭雅芬',
      title: '應收帳款', // 工務部監管
      id: '6bf2925e-8983-4164-ba28-774a27bb3bac',
    },
    //
    //
    //
  }))
);

export { useVipInfo };
