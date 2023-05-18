import { useState } from "react"

// component
import StringList from "./quotationTotal/TextListEditor"
import PayInfo from "./quotationTotal/payInfo"
import PayInfo_legacy from "./quotationTotal/payInfo_legacy"
import Appendix from "./quotationTotal/appendix"
// css
import style from "./quotationTotal.module.scss"
// type
import { Class_quotation } from "hooks/quotation/useQuotation"
import { Class_legacyContract } from "hooks/quotation/useLegacyContract"
import { fakeApi_memo } from "fakeDatabase/fakeAPI/fakeMemoApi";
import { fakeApi_quoteRange } from "fakeDatabase/fakeAPI/fakeQuoteRangeApi";


export default function QuotationTotal(
  {
    classQuotation,
    getFakeMemo,
    getFakeQuotaRange,
    disabled = false,
  }:
    {
      classQuotation: Class_quotation | Class_legacyContract
      getFakeMemo: typeof fakeApi_memo["get"]
      getFakeQuotaRange: typeof fakeApi_quoteRange["get"]
      disabled: boolean
    }) {

  const { identify } = classQuotation

  // --------------------
  const { classMemo, classQuoteRange } = classQuotation
  // --------------------
  const memoObj = {
    stringArr: classMemo.stringArr,
    editString: classMemo.editString,
    addString: classMemo.addString,
    delString: classMemo.delString,
  }

  const [alternateMemoSearchValue, setAlternateMemoSearchValue] = useState("")
  const memoFilter = {
    content: alternateMemoSearchValue
  }
  const searchAlternateMemo = (v: string) => {
    setAlternateMemoSearchValue(v)
  }
  const alternateMemo = getFakeMemo(memoFilter).map((memo) => memo.content)
  // --------------------
  const quoteRangeObj = {
    stringArr: classQuoteRange.stringArr,
    editString: classQuoteRange.editString,
    addString: classQuoteRange.addString,
    delString: classQuoteRange.delString,
  }

  const [quoteRangeSearchValue, setQuoteRangeSearchValue] = useState("")
  const quoteRangeFilter = {
    content: quoteRangeSearchValue
  }
  const searchAlternateQuoteRange = (v: string) => {
    setQuoteRangeSearchValue(v)
  }
  const alternateQuoteRange =
    getFakeQuotaRange(quoteRangeFilter).map((quoateRange) => quoateRange.content)


  // ====================================================
  return (
    <div className={style.container}>
      <StringList
        stringObj={memoObj}
        alternateArr={alternateMemo} searchAlternate={searchAlternateMemo}
        label="備註"
        disabled={disabled} />
      <div className={style.layer01}>
        <div>
          <StringList
            stringObj={quoteRangeObj}
            alternateArr={alternateQuoteRange} searchAlternate={searchAlternateQuoteRange}
            label="報價範圍"
            disabled={disabled} />
          <Appendix disabled={disabled} />
        </div>
        {identify === "normal" &&
          <PayInfo
            classQuotation={classQuotation}
            disabled={disabled}
          />}
        {identify === "legacy" &&
          <PayInfo_legacy
            classQuotation={classQuotation}
            disabled={disabled}
          />}

      </div>
    </div >
  )
}