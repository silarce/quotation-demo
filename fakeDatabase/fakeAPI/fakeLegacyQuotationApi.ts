import { format, subYears } from "date-fns"


import { TlegacyQuotation, fakeLegacyQuotationDataList, emptyLegacyQuotation } from "fakeDatabase/domestic/_fakeLegacyQuotation"
import { TclientProfile, fakeClientProfileList } from "fakeDatabase/client/_fakeClients"


import _ from "lodash"


class Class_fakeApi_legacyQuotation {
  constructor(quotation: TlegacyQuotation) {
    this._quotation = quotation
  } // constructor


  private _quotation: TlegacyQuotation
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

  put(quotation: TlegacyQuotation) {
    const { quotationId } = quotation.basicInfo
    this._quotation = quotation
    fakeLegacyQuotationDataList[quotationId] = quotation
  }

  post(quotation: TlegacyQuotation) {
    const { quotationId } = quotation.basicInfo
    this._quotation = quotation
    if (fakeLegacyQuotationDataList[quotationId]) return alert("此報價單編號已存在")
    fakeLegacyQuotationDataList[quotationId] = quotation
  }

}


const fakeApi_legacyQuotation_creator = (id: string) => {
  const quotation = fakeLegacyQuotationDataList[id]
  if (quotation) return new Class_fakeApi_legacyQuotation(quotation)
  if (!quotation) {
    const now = format(subYears(new Date(), 1911), "yyy-MM-dd")
    const newQuotation = _.cloneDeep(emptyLegacyQuotation)
    newQuotation.basicInfo.quotationId = id
    newQuotation.basicInfo.date = now
    return new Class_fakeApi_legacyQuotation(newQuotation)
  }
  return undefined
}


export type { Class_fakeApi_legacyQuotation }
export { fakeApi_legacyQuotation_creator as fakeApi_quotation_creator }

