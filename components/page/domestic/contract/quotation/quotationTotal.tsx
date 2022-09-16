
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




export default function QuotationTotal(
  { remarkListState, rangeListState,
    payInfoState, productStates, disabled = false }:
    {
      remarkListState: TuseRemarkList
      rangeListState: TuseRangeList
      payInfoState: TusePayInfo
      productStates: TuseProduct
      disabled: boolean
    }) {

  // ====================================================
  return (
    <div className={style.container}>
      <MemoList remarkListState={remarkListState} disabled={disabled} />
      <div className={style.layer01}>
        <div>
          <RangeList rangeListState={rangeListState} disabled={disabled} />
          <Appendix disabled={disabled} />
        </div>
        <PayInfo payInfoState={payInfoState} productStates={productStates}
          disabled={disabled} />
      </div>
    </div >
  )
}