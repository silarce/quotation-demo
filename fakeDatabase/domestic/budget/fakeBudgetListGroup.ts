import {
  Tbudget as TbudgetOri,
  // TbudgetObjList as TbudgetObjListOri,
  fakeBudgetObjList as fakeBudgetObjListOri,
  fakeBudgetKeyList,
} from './fakeBudgetList_basic';
import { TbudgetDetail, fakeBudgetDetailList } from './fakeBudgetDetailList';

import _ from 'lodash';

interface Tbudget_detail extends TbudgetOri {
  detail: TbudgetDetail[];
}

interface TbudgetObjList {
  [key: string]: Tbudget_detail;
}
type TbudgetList = Tbudget_detail[];

const fakeBudgetObjList: TbudgetObjList = _.cloneDeep(fakeBudgetObjListOri) as TbudgetObjList;

fakeBudgetKeyList.forEach((key) => {
  fakeBudgetObjList[key].detail = fakeBudgetDetailList;
});

const fakeBudgetList: TbudgetList = Object.values(fakeBudgetObjList);

// const row01Config = {
//   quotationId: {
//     label: "報價編號 / 日期",
//     width: "100px"
//   },
//   clientName: {
//     label: "客戶名稱 / 工程名稱",
//     width: "auto"
//   },
//   contactName: {
//     label: "聯絡人",
//     width: "85px"
//   },
//   contactPhone: {
//     label: "聯絡電話",
//     width: "105px"
//   },
//   undertaker: {
//     label: "承辦人",
//     width: "85px"
//   },
//   discount: {
//     label: "總折數",
//     width: "65px"
//   },
//   doorQty: {
//     label: "樘數",
//     width: "28px"
//   },
//   budgetAmount: {
//     label: "合約金額",
//     width: "85px"
//   },
// }

// const row02Config = {
//   date: {
//     width: "100px"
//   },
//   country: {
//     width: "65px"
//   },
//   projectName: {
//     width: " auto"
//   },
// }
// const detailConfig = {
//   date: {
//     width: "100px"
//   },
//   describe: {
//     width: "auto"
//   },
//   discount: {
//     width: "65px"
//   },
//   doorQty: {
//     width: "28px"
//   },
//   contractAmount: {
//     width: "85px"
//   },
// }

const fakeBudgetListGroup = {
  row01Index: [
    'quotationId',
    'clientName',
    'contactName',
    'contactPhone',
    'undertaker',
    'discount',
    'doorQty',
    'budgetAmount',
  ],
  row02Index: ['date', 'country', 'projectName'],
  fakeBudgetList,
};

type TfakeBudgetListGroup = typeof fakeBudgetListGroup;

export type { Tbudget_detail as Tbudget, TfakeBudgetListGroup, TbudgetObjList, TbudgetList, TbudgetDetail };
export { fakeBudgetListGroup };
