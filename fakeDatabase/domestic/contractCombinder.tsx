

import {
  Tcontract, TcontractObjList,
  fakeContractObjList as fakeContractObjListOri,
} from "fakeDatabase/domestic/contract/fakeContractList";
import {
  TcontractMemo,
  fakeContractMemoObjList, fakeContractMemoList
} from "fakeDatabase/domestic/contract/fakeMemoList";


const _ = require("lodash")






// ======================================================

interface TfakeContractSimple extends Tcontract {
  memoList: TcontractMemo[]
}

// type TfakeContractListSimple = {
//   [key in (keyof TcontractObjList)]: TfakeContractSimple
// }
type TfakeContractListSimple = TfakeContractSimple[]

const fakeContractListSimple: TfakeContractListSimple = (() => {
  const fakeContractObjList = _.cloneDeep(fakeContractObjListOri)
  Object.keys(fakeContractObjList)
    .forEach((key) => fakeContractObjList[key].memoList = [])
  fakeContractMemoList.forEach((item) => {
    const { belongQuotation } = item
    if (fakeContractObjList[belongQuotation]) {
      fakeContractObjList[belongQuotation].memoList.push(item)
    }
  })
  const fakeContractList: TfakeContractListSimple = Object.values(fakeContractObjList)

  return fakeContractList
})()

// ======================================================

export type { TfakeContractSimple, TfakeContractListSimple }
export { fakeContractListSimple }