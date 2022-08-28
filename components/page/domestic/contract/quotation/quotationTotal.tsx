import { useState } from "react"

// component
import MemoList from "./quotationTotal/memoList"
import RangeList from "./quotationTotal/rangeList"



// css
import style from "./quotationTotal.module.scss"
import styleL from "./quotationTotal/local.module.scss"
// type
import { TuseMemoList } from "./hook/useMemoList"
import { TuseRangeList } from "./hook/useRangeList"




export default function QuotationTotal({ memoListState, rangeListState }:
  {
    memoListState: TuseMemoList
    rangeListState: TuseRangeList
  }) {




  // ====================================================
  return (
    <div className={style.container}>
      {/* ========================================== */}
      <MemoList memoListState={memoListState} />
      {/* ========================================== */}

      <div className={style.layer01}>
        <RangeList rangeListState={rangeListState} />
        {/* -------------------------*/}

        <div className={style.total}>
        </div>
      </div>

      {/* ============================================= */}

    </div >
  )
}