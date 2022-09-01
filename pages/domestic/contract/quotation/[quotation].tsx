
import { useState } from "react"
import { useRouter } from "next/router"
import { NextRouter } from "next/router"

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
{ fakeEmptyMemo, fakeEmptyRange, fakeProfileList } from "meta/fakeData/fakeQuotation"
import ru from "date-fns/esm/locale/ru/index.js"

type TquotationData = typeof fakeQuotationData


// 產品應該會是點進來後才跟後端要資料
// 現在先做一個假的報價單資料表import進來，然後跟收到的報價單id(quotation)檢索對應的資料
// 報價單資料複雜由龐大，沿用fakeQuotaion然後把profile替換掉好了
// 所以，做fakeProfileList吧,寫在fakeQuotation.tsx裡面


// 如果使用者貼上動態url進來，一開始router.query會是空的
// 要運行第二次後router.query才會有東西，所以包這一層判斷是否已經ready
export default function Quotation() {
  const router = useRouter()
  const isReady = router.isReady

  if (!isReady) return null

  return <TheQuotation router={router} />
}

function TheQuotation({ router }: { router: NextRouter }) {

  // quotation為報價單的id，也可能是"newQuotation"字串
  // 如果quotation為報價單id，那newQuotationId應該會是undefined
  let { quotation, newQuotationId } = router.query
  if (typeof newQuotationId !== "string") newQuotationId = ""

  // 正式接上api前先這樣處理
  let quotationData: TquotationData | undefined;
  if (typeof quotation === "string" && quotation !== "newQuotation") {
    quotationData = fakeQuotationData
    quotationData.profile = fakeProfileList[quotation]
    if (!quotationData.profile) quotationData = undefined
  }

  // =========================================================
  // 是否可編輯
  const [allowEdit, setAllowEdit] = useState(false)
  // =========================================================
  // profile //報價單基本資料
  const profileState = useProfile({
    quotationData,
    newQuotationId,
  })
  // product // 產品設定
  const productStates = useProduct(quotationData?.productList, !allowEdit)
  // memo // 備註
  const memoListState = useMemoList(quotationData)
  // range // 報價範圍
  const rangeListState = useRangeList(quotationData)
  // payInfo // 支付資訊
  const payInfoState = usePayInfo(quotationData)
  // sinature //簽名
  const sinatureState = useSinature(quotationData)
  // =========================================================
  const tagList: TtagList = [
    {
      label: `報價編號 ${newQuotationId || quotation}`,
      onClick: () => alert(newQuotationId || quotation)
    },
    { label: "工程聯絡單", onClick: () => alert("工程聯絡單") },
  ]
  const panel_newQuotation: TpanelList = [
    { type: "redButton", label: "上傳", onClick: () => alert("上傳") },
    { type: "myButton", label: "取消", onClick: () => router.back() },
  ]
  const panel_quotation: TpanelList = [
    { type: "myButton", label: "匯出報價單", onClick: () => alert("匯出報價單") },
    { type: "myButton", label: "送審", onClick: () => alert("送審") },
    {
      type: allowEdit ? "redButton" : "myButton",
      label: allowEdit ? "結束編輯" : `編輯`,
      onClick: () => setAllowEdit(state => !state),
      className: style.editButton
    },
    { type: "myButton", label: "返回", onClick: () => router.back() },
  ]
  // =========================================================
  // =========================================================
  // =========================================================
  // =========================================================
  // 如果報價單編號錯誤(找不到這筆報價單)，就return NoQuotation
  if (quotation !== "newQuotation" && !quotationData)
    return <NoQuotation quotationId={quotation as string} />
  // =========================================================
  return (
    <div className={style.container}>
      <PageHeader02 tagList={tagList}
        panelList={newQuotationId ? panel_newQuotation : panel_quotation}
      />

      <div className={style.mainContainer}>
        <div className={style.quotation}> {/* scroll wrapper */}
          {/* 工程名稱 */}
          <QuotationProfile profileState={profileState} disabled={!allowEdit} />
          {/*  */}
          <h5 className={style.titleHr}>合約項目</h5>
          {/* 主產品設定 */}
          <QuotationProduction productStates={productStates} />

          <div className={style.redWrapper}>
            {/* 材料配件設定 */}
            <QuotationComponent productStates={productStates} disabled={!allowEdit} />
            <hr />
            {/* 選配設定 */}
            <QuotationAccessory productStates={productStates} />
          </div>
          {/* 備註/報價範圍/付款資訊 */}
          <QuotationTotal
            {...{
              memoListState, rangeListState,
              payInfoState, productStates,
              disabled: !allowEdit
            }} />
          {/* 簽名 */}
          <QuotationSinature sinatureState={sinatureState} disabled={!allowEdit} />
        </div>
      </div>
    </div>
  )
}


// ===============================================================

const NoQuotation = ({ quotationId }: { quotationId: string }) => {
  const router = useRouter()
  const toBack = () => {
    router.back()
  }
  return (
    <div className={style.noQuotation}>
      <span>沒有這個報價單ID</span>
      <span>{quotationId}</span>
      <button onClick={toBack}>回上一頁</button>
    </div>
  )

}




