import { Tquotation, fakeQuotationDataList } from "fakeDatabase/domestic/_fakeQuotation"
import { TclientProfile, fakeClientProfileList } from "fakeDatabase/client/_fakeClients"

import { fakeMemoDataArr } from "fakeDatabase/fakeMemo"
import { fakeQuoteRangeDataArr } from "fakeDatabase/fakeQuoteRange"

// const _ = require("lodash")
import _ from "lodash"


class Class_fakeApi_quotation {
  constructor(quotation: Tquotation) {
    this._quotation = quotation
  } // constructor


  private _quotation: Tquotation
  get() {
    const theData = _.cloneDeep(this._quotation)
    const fakeClienProfile = _.cloneDeep(fakeClientProfileList[theData.clientId])
    // const memoArr = theData.memoIdArr.map((id) => fakeMemoDataArr[id - 1])
    // const rangeArr = theData.rangeIdArr.map((id) => fakeQuoteRangeDataArr[id - 1])
    return {
      ...theData,
      fakeClienProfile,
      // memoArr,
      // rangeArr,
    }
  }
  put(quotation: Tquotation) {
    const { quotationId } = quotation.basicInfo
    this._quotation = quotation
    fakeQuotationDataList[quotationId] = quotation
  }

}


const fakeApi_quotation_creator = (id: string) => {
  const quotation = fakeQuotationDataList[id]
  if (quotation) return new Class_fakeApi_quotation(quotation)
  return undefined
}


export type { Class_fakeApi_quotation }
export { fakeApi_quotation_creator }
