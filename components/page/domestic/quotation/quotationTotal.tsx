import { useState } from "react"


// component
import MemoList from "./quotationTotal/remarkList"
import RangeList from "./quotationTotal/rangeList"
import PayInfo from "./quotationTotal/payInfo"
import Appendix from "./quotationTotal/appendix"
// css
import style from "./quotationTotal.module.scss"
// type
import { TuseRemarkList } from "./hook/useRemarkList"
import { TuseRangeList } from "./hook/useRangeList"
import { TusePayInfo } from "./hook/usePayInfo"
import { TuseProduct } from "./hook/useProduct"
import { Class_quotation } from "hooks/quotation/useQuotation"


export default function QuotationTotal(
  {
    classQuotation,
    disabled = false,
    // remarkListState, rangeListState,
    // payInfoState, 
    // prodState
  }:
    {
      classQuotation: Class_quotation
      disabled: boolean
      // remarkListState: TuseRemarkList
      // rangeListState: TuseRangeList
      // payInfoState: TusePayInfo
      // prodState: TuseProduct
    }) {


  // ====================================================
  return (
    <div className={style.container}>
      {/* <MemoList remarkListState={remarkListState} disabled={disabled} /> */}
      <div className={style.layer01}>
        {/* <div>
          <RangeList rangeListState={rangeListState} disabled={disabled} />
          <Appendix disabled={disabled} />
        </div> */}
        <PayInfo
          classQuotation={classQuotation}
          disabled={disabled}
        />
      </div>
    </div >
  )
}