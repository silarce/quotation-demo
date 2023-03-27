import { format, subYears } from "date-fns"


import { Tquotation, fakeQuotationDataList, emptyQuotation } from "fakeDatabase/domestic/_fakeQuotation"
import { TclientProfile, fakeClientProfileList } from "fakeDatabase/client/_fakeClients"

// import { fakeMemoDataArr } from "fakeDatabase/fakeMemo"
// import { fakeQuoteRangeDataArr } from "fakeDatabase/fakeQuoteRange"

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

  post(quotation: Tquotation) {
    const { quotationId } = quotation.basicInfo
    this._quotation = quotation
    if (fakeQuotationDataList[quotationId]) return alert("此報價單編號已存在")
    fakeQuotationDataList[quotationId] = quotation
  }

}


const fakeApi_quotation_creator = (id: string) => {
  const quotation = fakeQuotationDataList[id]
  if (quotation) return new Class_fakeApi_quotation(quotation)
  if (!quotation) {
    const now = format(subYears(new Date(), 1911), "yyy-MM-dd")
    const newQuotation = _.cloneDeep(emptyQuotation)
    newQuotation.basicInfo.quotationId = id
    newQuotation.basicInfo.date = now
    return new Class_fakeApi_quotation(newQuotation)
  }
  return undefined
}


export type { Class_fakeApi_quotation }
export { fakeApi_quotation_creator }

