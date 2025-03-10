import moment, { Moment } from 'moment';
import _ from 'lodash';
import { TemployeeDto } from 'js/api/dtoTypes';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

type Tstate_electronicItem = {
  id?: string;
  category: string;
  itemName: string;
  quantity: number | null;
  unit: string | null;
  code: string | null;

  // itemName為'控制箱/盤'時，subItemName為'捲門/水閘門'，其他為null或undefined
  subItemName?: null | '捲門/水閘門';
  // // 用來辨別item用的，必須為唯一值
  // // 目前只有需要編輯category的item會用到
  // // idName?: string;

  inputCategory?: () => Promise<string>;
  categoryValue: string;
};

type Tstate_info = {
  date: Moment | null;
  indexNumber: string;
  picker: TemployeeDto | undefined;
  preparer: TemployeeDto | undefined;
  doorModelName: string | undefined;
  doorQty: `${number}` | '';
};

// ==================================================================

// w category應該會是唯一的，並且之後會用category作為key
const defaultStateArr_鎖盒: Tstate_electronicItem[] = [
  {
    category: '智慧型（含主機）',
    categoryValue: '智慧型（含主機）',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  // {
  //   category: '智慧型（含主機）+ 發訊器',
  //   itemName: '鎖盒',
  //   subItemName: undefined,
  //   quantity: null,
  //   unit: null,
  //   code: null,
  // },
  // {
  //   category: '智慧型（含主機）+ 發射器',
  //   itemName: '鎖盒',
  //   subItemName: undefined,
  //   quantity: null,
  //   unit: null,
  //   code: null,
  // },
  // {
  //   category: '智慧型（含主機）+ 發訊器 + 發射器',
  //   itemName: '鎖盒',
  //   subItemName: undefined,
  //   quantity: null,
  //   unit: null,
  //   code: null,
  // },
  {
    category: '電子式',
    categoryValue: '電子式',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '防爆式',
    categoryValue: '防爆式',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '面板式',
    categoryValue: '面板式',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '埋入式',
    categoryValue: '埋入式',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '外露式',
    categoryValue: '外露式',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_鎖匙: Tstate_electronicItem[] = [
  {
    category: '鎖號',
    categoryValue: '鎖號',
    itemName: '鎖匙',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
    async inputCategory() {
      const str = await new Promise<string>((resolve) => {
        const { destroy } = myAlert.input({
          title: '鎖號',
          onConfirm: (value) => {
            destroy();
            resolve('鎖號 : ' + value);
          },
        });
      });

      return str;
    },
  },
  {
    category: '特殊鎖號',
    categoryValue: '特殊鎖號',
    itemName: '鎖匙',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_控制箱盤: Tstate_electronicItem[] = [
  {
    category: '3HP馬達控制箱(380V)',
    categoryValue: '3HP馬達控制箱(380V)',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '2HP馬達控制箱(380V)',
    categoryValue: '2HP馬達控制箱(380V)',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '3HP馬達控制箱(220V)',
    categoryValue: '3HP馬達控制箱(220V)',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '2HP馬達控制箱(220V)',
    categoryValue: '2HP馬達控制箱(220V)',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    // category: '彈射門控制箱_HP _V(大同/東元)',
    // categoryValue category: '彈射門控制箱_HP _V(大同/東元)',
    category: '彈射門控制箱',
    // categoryValue: '彈射門控制箱 HP  V ',
    categoryValue: '彈射門控制箱',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
    async inputCategory() {
      const str = await new Promise<string>((resolve) => {
        const { destroy } = myAlert.input({
          title: '彈射門控制箱',
          onConfirm: (value) => {
            destroy();
            resolve('彈射門控制箱 : ' + value);
          },
        });
      });

      return str;
    },
  },
  {
    category: 'UPS不斷電系統 1HP',
    categoryValue: 'UPS不斷電系統 1HP',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: 'UPS不斷電系統 1/2HP',
    categoryValue: 'UPS不斷電系統 1/2HP',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_押扣: Tstate_electronicItem[] = [
  {
    itemName: '押扣',
    subItemName: undefined,
    category: '三點式(一般)',
    categoryValue: '三點式(一般)',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '押扣',
    subItemName: undefined,
    category: '三點式(遮煙)',
    categoryValue: '三點式(遮煙)',
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_消防備品: Tstate_electronicItem[] = [
  {
    itemName: '消防備品',
    subItemName: undefined,
    category: '煙感器',
    categoryValue: '煙感器',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '消防備品',
    subItemName: undefined,
    category: '中繼器 1φ 220v',
    categoryValue: '中繼器 1φ 220v',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '消防備品',
    subItemName: undefined,
    category: '中繼器 3φ 380v',
    categoryValue: '中繼器 3φ 380v',
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_主機: Tstate_electronicItem[] = [
  {
    itemName: '主機',
    subItemName: undefined,
    category: '遙控器（1:2）+ 障感器',
    categoryValue: '遙控器（1:2）+ 障感器',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '主機',
    subItemName: undefined,
    category: '遙控器（1:2）',
    categoryValue: '遙控器（1:2）',
    quantity: null,
    unit: null,
    code: 'A',
  },
  {
    itemName: '主機',
    subItemName: undefined,
    category: '障感器',
    categoryValue: '障感器',
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr_紅外線: Tstate_electronicItem[] = [
  {
    itemName: '紅外線',
    subItemName: undefined,
    category: '反射式',
    categoryValue: '反射式',
    quantity: null,
    unit: null,
    code: 'E',
  },
  {
    itemName: '紅外線',
    subItemName: undefined,
    category: '對照式',
    categoryValue: '對照式',
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr = [
  ...defaultStateArr_鎖盒,
  ...defaultStateArr_鎖匙,
  ...defaultStateArr_押扣,
  ...defaultStateArr_控制箱盤,
  ...defaultStateArr_消防備品,
  ...defaultStateArr_主機,
  ...defaultStateArr_紅外線,
];

const categoryArr = defaultStateArr.map((item) => item.category);

function orderDetailArr<
  D extends {
    category: string;
  }[]
>({
  //
  detailArr,
}: {
  detailArr: D;
}) {
  const orderedArr = _.sortBy(detailArr, (item) => {
    let index = categoryArr.indexOf(item.category);

    // 若沒有找到，就排在最後
    if (index === -1) {
      index = 99999;
    }

    return index;
  });

  return orderedArr as D;
}

const createDefaultState = () => {
  const defaultStateArr_copy = _.cloneDeep(defaultStateArr);

  const defaultStateList: { [key: string]: Tstate_electronicItem } = {};

  defaultStateArr_copy.forEach((item) => {
    const { category } = item;
    defaultStateList[category] = item;
  });

  return {
    defaultStateArr: defaultStateArr_copy,
    defaultStateList,
  };
};

const createEmptyStateInfo = (): Tstate_info => ({
  date: null,
  indexNumber: '',
  picker: undefined,
  preparer: undefined,
  doorModelName: undefined,
  doorQty: '',
});

// =======================================================================
export type { Tstate_electronicItem, Tstate_info };
export { createEmptyStateInfo, createDefaultState, orderDetailArr };
