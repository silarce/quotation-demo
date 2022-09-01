import { useState } from "react"

// component
import MemoList from "./quotationTotal/memoList"
import RangeList from "./quotationTotal/rangeList"
import PayInfo from "./quotationTotal/payInfo"

// css
import style from "./quotationTotal.module.scss"
import styleL from "./quotationTotal/local.module.scss"
// type
import { TuseMemoList } from "./hook/useMemoList"
import { TuseRangeList } from "./hook/useRangeList"
import { TusePayInfo } from "./hook/usePayInfo"
import { TuseProduct } from "./hook/useProduct"




export default function QuotationTotal(
  { memoListState, rangeListState,
    payInfoState, productStates, disabled = false }:
    {
      memoListState: TuseMemoList
      rangeListState: TuseRangeList
      payInfoState: TusePayInfo
      productStates: TuseProduct
      disabled: boolean
    }) {

  // ====================================================
  return (
    <div className={style.container}>
      <MemoList memoListState={memoListState} disabled={disabled} />
      <div className={style.layer01}>
        <RangeList rangeListState={rangeListState} disabled={disabled} />
        <PayInfo payInfoState={payInfoState} productStates={productStates}
          disabled={disabled} />
      </div>
    </div >
  )
}