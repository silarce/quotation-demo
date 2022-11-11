// 報價單
import { useState, useMemo } from "react"
import { useRouter } from "next/router"
import { NextRouter } from "next/router"




// global gear
import PageHeader02, { TtagList, TpanelList } from "components/PageHeader/pageHeader02"
import { RotatingArrow01 } from 'public/image/icon/iconComponent/rotatingArrow';


// hook
import useProfile from "components/page/domestic/contract/quotation/hook/useProfile"
import useProduct, { TuseProduct } from "components/page/domestic/contract/quotation/hook/useProduct"
import useRemarkList from "components/page/domestic/contract/quotation/hook/useRemarkList"
import useRangeList from "components/page/domestic/contract/quotation/hook/useRangeList"
import usePayInfo from "components/page/domestic/contract/quotation/hook/usePayInfo"
import useSinature from "components/page/domestic/contract/quotation/hook/useSinature"


// icon
import iconUpload from "public/image/icon/upload.svg"

// css
import style from "./quotation.module.scss"

// fakeData type
import { Tquotation, fakeQuotationObjListOri } from "fakeDatabase/domestic/quotation/fakeQuotationList"
import { fakeProdChangingRecordList } from "fakeDatabase/domestic/quotation/fakeChangeProductRecord"
// =============================================================

// 生成假資料
const fakeQuotationObjList = fakeQuotationObjListOri()


// =============================================================
// =============================================================
// =============================================================
export default function Quotation() {
  const router = useRouter()
  const isReady = router.isReady

  if (!isReady) return null

  return <TheQuotation router={router} />
}

function TheQuotation({ router }: { router: NextRouter }) {


  let {
    quotationId, //報價單id //若為新增報價單則為newQuotation
    newQuotationId, // 新增報價單的id // 若不是新增報價單則為undefined
  } = router.query
  if (typeof newQuotationId !== "string") newQuotationId = ""

  // 正式接上api前先這樣處理，但是我已經忘記這是在處理什麼了.....
  let quotationData: Tquotation | undefined;
  if (typeof quotationId === "string" && quotationId !== "newQuotation") {
    quotationData = fakeQuotationObjList[quotationId]
    if (!quotationData) quotationData = undefined
  }
  // --------------------------------------------------------------------------
  // 是否可編輯
  const [allowEdit, setAllowEdit] =
    useState(quotationId === "newQuotation" ? true : false)
  // 合約項目 追加/追減項目的開關
  const [switch01, setSwitch01] = useState(true)
  // 展開版本追加追減紀錄的開關
  const [switch02, setSwitch02] = useState(false)
  // --------------------------------------------------------------------------
  // profile //報價單基本資料
  const profileState = useProfile({
    quotationData,
    newQuotationId,
  })
  // 主產品資料
  const prodStates = useProduct(quotationData?.productList, !allowEdit)
  const prodStates02 = useProduct(quotationData?.productList, !allowEdit)
  // memo // 備註
  const remarkListState = useRemarkList(quotationData)
  // range // 報價範圍
  const rangeListState = useRangeList(quotationData)
  // payInfo // 支付資訊
  const payInfoState = usePayInfo(quotationData)
  // sinature //簽名
  const sinatureState = useSinature(quotationData)
  // --------------------------------------------------------------------------
  const [showPdf, setShowPdf] = useState(false)
  // --------------------------------------------------------------------------
  const tagList: TtagList = [
    {
      label: `報價編號 ${newQuotationId || quotationId}`,
      onClick: () => alert(newQuotationId || quotationId)
    },
    { label: "工程聯絡單", onClick: () => alert("工程聯絡單") },
  ]

  const panel_editable: TpanelList = [
    { type: "myButton", label: "狀態", onClick: () => alert("施工中") },
    { type: "myButton", label: "歷史狀態", onClick: () => alert("歷史狀態") },
    { type: "redButton", label: "上傳", onClick: () => alert("上傳") },
    { type: "myButton", label: "取消", onClick: () => setAllowEdit(false) },
  ]
  const panel_noEditable: TpanelList = [
    {
      type: "myButton", label: "匯出報價單", img: iconUpload.src,
      onClick: () => setShowPdf(true)
    },
    { type: "myButton", label: "編輯", onClick: () => setAllowEdit(true) },
    { type: "myButton", label: "送審", onClick: () => alert("送審") },
  ]
  // --------------------------------------------------------------------------
  // 如果報價單編號錯誤(找不到這筆報價單)，就return NoQuotation
  // if (quotation !== "newQuotation" && !quotationData)
  //   return <NoQuotation quotationId={quotation as string} />
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  return (
    <div className={style.container}>
      {/* <PageHeader02 tagList={tagList}
        panelList={newQuotationId ? panel_newQuotation : panel_quotation}
      /> */}

      <div className={style.mainContainer}>
        <div className={style.quotation}>



        </div>
      </div>

    </div>
  )

}





