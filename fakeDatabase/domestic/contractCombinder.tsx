import {
  Tcontract,
  fakeContractObjList as fakeContractObjListOri,
} from 'fakeDatabase/domestic/contract/fakeContractList';
import { TcontractMemo, fakeContractMemoList } from 'fakeDatabase/domestic/contract/fakeMemoList';

// const _ = require('lodash');
import _ from 'lodash';

// ======================================================

// interface TfakeContractSimple extends Tcontract {
//   memoList: TcontractMemo[];
// }
type TfakeContractSimple = Tcontract & {
  [key: string]: {
    memoList: TcontractMemo[];
  };
};

type TfakeContractListSimple = TfakeContractSimple[];

const fakeContractListSimple: TfakeContractListSimple = (() => {
  const fakeContractObjList = _.cloneDeep(fakeContractObjListOri) as unknown as TfakeContractSimple;
  Object.keys(fakeContractObjList).forEach((key) => (fakeContractObjList[key].memoList = []));
  fakeContractMemoList.forEach((item) => {
    const { belongQuotation } = item;

    if (fakeContractObjList[belongQuotation]) {
      fakeContractObjList[belongQuotation].memoList.push(item);
    }
  });
  const fakeContractList: TfakeContractListSimple = Object.values(
    fakeContractObjList
  ) as unknown as TfakeContractListSimple;

  return fakeContractList;
})();

// ======================================================

export type { TfakeContractSimple, TfakeContractListSimple };
export { fakeContractListSimple };
