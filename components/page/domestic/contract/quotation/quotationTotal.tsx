import { useState } from "react"

// component
import MemoList from "./quotationTotal/memoList"


// global gear
import ModalListSelectorWithSearch from "components/global/gear/modal/modalListSelectorWithSearch"
import CellWithBar from "components/global/gear/cell/cellWithBar"
import { ModalInfo02 } from "components/global/gear/modal/simpleModal/alertModals"
// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"


// css
import style from "./quotationTotal.module.scss"
import styleL from "./quotationTotal/local.module.scss"
// type
import { TuseMemoList } from "./hook/useMemoList"
import { Tmemo } from "meta/fakeData/fakeQuotation"



export default function QuotationTotal({ memoListState }:
  { memoListState: TuseMemoList }) {




  // ====================================================
  return (
    <div className={style.container}>
      {/* ========================================== */}
      <MemoList memoListState={memoListState} />
      {/* ========================================== */}

      <div className={style.layer01}>
        <div className={style.range}>
          range
        </div>
        {/* -------------------------*/}

        <div className={style.total}>
        </div>
      </div>

      {/* ============================================= */}

    </div >
  )
}