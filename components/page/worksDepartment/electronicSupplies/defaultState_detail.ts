import moment, { Moment } from 'moment';
import _ from 'lodash';
import { TemployeeDto } from 'js/api/dtoTypes';

type Tstate_electronicItem = {
  id?: string;
  category: string;
  itemName: string;
  quantity: number | null;
  unit: string | null;
  code: string | null;
  // code: string | null;
  subItemName?: null | '捲門/水閘門';
};
// itemName為'控制箱/盤'時，subItemName為'捲門/水閘門'，其他為null或undefined

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
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '智慧型（含主機）+ 發訊器',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '智慧型（含主機）+ 發射器',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '智慧型（含主機）+ 發訊器 + 發射器',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '面板式',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '埋入式',
    itemName: '鎖盒',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '外露式',
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
    itemName: '鎖匙',
    subItemName: undefined,
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '特殊鎖號',
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
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '2HP馬達控制箱(380V)',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '3HP馬達控制箱(220V)',
    itemName: '控制箱/盤',
    subItemName: '捲門/水閘門',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    category: '2HP馬達控制箱(220V)',
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
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '消防備品',
    subItemName: undefined,
    category: '中繼器 1φ 220v',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '消防備品',
    subItemName: undefined,
    category: '中繼器 3φ 380v',
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
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '主機',
    subItemName: undefined,
    category: '遙控器（1:2）',
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '主機',
    subItemName: undefined,
    category: '障感器',
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
    quantity: null,
    unit: null,
    code: null,
  },
  {
    itemName: '紅外線',
    subItemName: undefined,
    category: '對照式',
    quantity: null,
    unit: null,
    code: null,
  },
];

const defaultStateArr = [
  ...defaultStateArr_鎖盒,
  ...defaultStateArr_鎖匙,
  ...defaultStateArr_控制箱盤,
  ...defaultStateArr_押扣,
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
  date: moment(),
  indexNumber: '',
  picker: undefined,
  preparer: undefined,
  doorModelName: undefined,
  doorQty: '',
});

// =======================================================================
export type { Tstate_electronicItem, Tstate_info };
export { createEmptyStateInfo, createDefaultState, orderDetailArr };
