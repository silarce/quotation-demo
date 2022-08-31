import { useRouter } from "next/router"


// components
import QuotationProfile from "components/page/domestic/contract/quotation/quotationProfile"
import QuotationProduction from "components/page/domestic/contract/quotation/quotationProduct"
import QuotationComponent from "components/page/domestic/contract/quotation/quotationComponent"
import QuotationAccessory from "components/page/domestic/contract/quotation/quotationAccessory"
import QuotationTotal from "components/page/domestic/contract/quotation/quotationTotal"
import QuotationSinature from "components/page/domestic/contract/quotation/quotationSinature"

// global gear
import PageHeader02, { TtagList, TpanelList } from "components/PageHeader/pageHeader02"

// hook
import useProfile from "components/page/domestic/contract/quotation/hook/useProfile"
import useProduct from "components/page/domestic/contract/quotation/hook/useProduct"
import useMemoList from "components/page/domestic/contract/quotation/hook/useMemoList"
import useRangeList from "components/page/domestic/contract/quotation/hook/useRangeList"
import usePayInfo from "components/page/domestic/contract/quotation/hook/usePayInfo"
import useSinature from "components/page/domestic/contract/quotation/hook/useSinature"
// css
import style from "./[quotation].module.scss"

// fakeData
import fakeQuotationData,
{ fakeEmptyMemo, fakeEmptyRange } from "meta/fakeData/fakeQuotation"


export default function Quotation() {

  const router = useRouter()
  let { newQuotationId } = router.query
  // if (typeof newQuotationId !== "string") newQuotationId = ""
  // =========================================================
  // profile
  const profileState = useProfile({
    // quotationData: fakeQuotationData,
    newQuotationId
  })
  // -------------------
  // product
  // const productStates = useProduct()
  const productStates = useProduct(fakeQuotationData.productList)
  // memo
  const memoListState = useMemoList()
  // const memoListState = useMemoList(fakeQuotationData)
  // range
  const rangeListState = useRangeList()
  // const rangeListState = useRangeList(fakeQuotationData)
  // payInfo
  const payInfoState = usePayInfo()
  // const payInfoState = usePayInfo(fakeQuotationData)
  // sinature
  const sinatureState = useSinature()
  // const sinatureState = useSinature(fakeQuotationData)

  // =========================================================
  const tagList: TtagList = [
    { label: `報價編號 ${newQuotationId}`, onClick: () => alert(newQuotationId) },
    { label: "工程聯絡單", onClick: () => alert("工程聯絡單") },
  ]
  const panelList: TpanelList = [
    { type: "redButton", label: "上傳", onClick: () => alert("上傳") },
    { type: "myButton", label: "取消", onClick: () => router.back() },
  ]
  // =========================================================
  if (newQuotationId === undefined) return null
  return (
    <div className={style.container}>

      <PageHeader02 tagList={tagList} panelList={panelList} />

      <div className={style.mainContainer}>
        <div className={style.quotation}> {/* scroll wrapper */}
          {/* 工程名稱 */}
          <QuotationProfile profileState={profileState} />
          {/*  */}
          <h5 className={style.titleHr}>合約項目</h5>
          {/* 主產品設定 */}
          <QuotationProduction productStates={productStates} />

          <div className={style.redWrapper}>
            {/* 材料配件設定 */}
            <QuotationComponent productStates={productStates} />
            <hr />
            {/* 選配設定 */}
            <QuotationAccessory productStates={productStates} />
          </div>
          {/* 備註/報價範圍/付款資訊 */}
          <QuotationTotal
            {...{
              memoListState, rangeListState,
              payInfoState, productStates
            }} />
          {/* 簽名 */}
          <QuotationSinature sinatureState={sinatureState} />
        </div>
      </div>
    </div>
  )
}




