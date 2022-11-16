
import { fakeQuotationIndex } from "../quotationIndex"

import {
  TquotProfile, fakeQuotProfileObjList
} from "./fakeQuotProfileList"

import {
  Tproduct, fakeQuotProductListOri,
} from "./fakeQuotProductionList"

import {
  Tremark,
  remarkOptions, fakeQuotRemarkList,
} from "./fakeQuotRemarkList"

import {
  Trange,
  rangeOptions, fakeQuotRangeList
} from "./fakeQuotRangeList"

import { Tsinature, fakeSinature, } from "./fakeSinature"

import { TpayInfo, fakeQuotPayInfo } from "./fakeQuotPayInfo"

interface Tquotation {
  profile: TquotProfile
  productList: Tproduct[]
  remarkList: Tremark[]
  rangeList: Trange[]
  payInfo: TpayInfo
  sinature: Tsinature
}

interface TquotationObjList {
  [key: string]: Tquotation
}

type TquotationList = Tquotation[]

const fakeQuotationObjListOri = () => {
  let fakeQuotationObjList: TquotationObjList = {}
  fakeQuotationIndex.forEach((key) => {
    fakeQuotationObjList[key] = {
      profile: fakeQuotProfileObjList[key],
      productList: fakeQuotProductListOri(),
      remarkList: fakeQuotRemarkList,
      rangeList: fakeQuotRangeList,
      payInfo: fakeQuotPayInfo,
      sinature: fakeSinature,
    }
  })
  return fakeQuotationObjList
}


const fakeQuotationListOri = () => Object.values(fakeQuotationObjListOri())


export type {
  Tquotation,
  TquotationObjList,
  TquotationList,
  TquotProfile,
  Tproduct,
  Tremark,
  Trange,
  TpayInfo,
  Tsinature,
}



export {
  fakeQuotationObjListOri, fakeQuotationListOri
}