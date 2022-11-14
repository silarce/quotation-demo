// 報價單
import {
  Dispatch, SetStateAction,
  useState, useMemo,
} from "react"
import { useRouter } from "next/router"
import { NextRouter } from "next/router"

// components
import QuotationProfile from "components/page/domestic/quotation/quotationProfile"
import QuotationProduction from "components/page/domestic/quotation/quotationProduct"
import QuotationComponent from "components/page/domestic/quotation/quotationComponent"
import QuotationAccessory from "components/page/domestic/quotation/quotationAccessory"
import QuotationTotal from "components/page/domestic/quotation/quotationTotal"
import QuotationSinature from "components/page/domestic/quotation/quotationSinature"
import QuotationProdChangingRecord from "components/page/domestic/quotation/quotationProdChangingRecord"
import QuotationRecord from "components/page/domestic/quotation/quotationRecord"


// global gear
import PageHeader02, { TtagList, TpanelList } from "components/PageHeader/pageHeader02"
import { RotatingArrow01 } from 'public/image/icon/iconComponent/rotatingArrow';
import Select03, { TcusStyleObj } from "components/global/gear/select/select03"
import InputModal from "components/global/gear/modal/simpleModal/inputModal"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

// hook
import useProfile from "components/page/domestic/quotation/hook/useProfile"
import useProduct, { TuseProduct } from "components/page/domestic/quotation/hook/useProduct"
import useRemarkList from "components/page/domestic/quotation/hook/useRemarkList"
import useRangeList from "components/page/domestic/quotation/hook/useRangeList"
import usePayInfo from "components/page/domestic/quotation/hook/usePayInfo"
import useSinature from "components/page/domestic/quotation/hook/useSinature"


// icon
import iconUpload from "public/image/icon/upload.svg"

// option
import { optionsCreator_quotationState, Toption } from "fakeDatabase/options/options"
const optionQuotationState = optionsCreator_quotationState()

// css
import style from "./quotation.module.scss"

// type
import type {
  StylesConfig, GroupBase,
} from 'react-select';

// fakeData type
import { Tquotation, fakeQuotationObjListOri } from "fakeDatabase/domestic/quotation/fakeQuotationList"
import { fakeProdChangingRecordList } from "fakeDatabase/domestic/quotation/fakeChangeProductRecord"
// =============================================================

// lab
import QuotationPdf from "components/page/domestic/paf/quotationPdf/quotationPdf"
// ========================================================


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
  // --------------------------------------------------------------------------
  // profile //報價單基本資料
  const profileState = useProfile({
    quotationData,
    newQuotationId,
  })
  // 主產品資料
  const prodStates = useProduct(quotationData?.productList, !allowEdit)
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

  const [quotationState, setQuotationState] = useState<Toption>({ value: "預算", label: "預算" })

  const [showMemoModal, setShowMemoModal] = useState(false)
  const inputModalOnConfirm = (v: string) => {
    if (!v) return myAlert.warning({ title: "請輸入註解" })
    alert("上傳")
    setShowMemoModal(false)
  }

  const tagList: TtagList = [
    {
      label: `報價編號 ${newQuotationId || quotationId}`,
      onClick: () => alert(newQuotationId || quotationId)
    },
    { label: "工程聯絡單", onClick: () => alert("工程聯絡單") },
  ]

  // optionQuotationState
  const panel_editable: TpanelList = [
    // { type: "myButton", label: "狀態", onClick: () => alert("施工中") },
    {
      custom: <QuotationStateSel
        quotationState={quotationState}
        setQuotationState={setQuotationState}
        options={optionQuotationState}
      />
    },
    // { type: "myButton", label: "狀態", onClick: () => alert("施工中") },
    // { type: "myButton", label: "歷史狀態", onClick: () => alert("歷史狀態") },
    { type: "redButton", label: "上傳", onClick: () => setShowMemoModal(true) },
    { type: "myButton", label: "取消", onClick: () => setAllowEdit(false) },
  ]
  const panel_noEditable: TpanelList = [
    {
      type: "myButton", label: "匯出報價單", img: iconUpload.src,
      onClick: () => setShowPdf(true)
    },
    { type: "myButton", label: "編輯", onClick: () => setAllowEdit(true) },
    { type: "myButton", label: "送審", onClick: () => alert("送審") },
    { type: "myButton", label: "返回", onClick: () => router.back() },
  ]

  // --------------------------------------------------------------------------
  // 如果報價單編號錯誤(找不到這筆報價單)，就return NoQuotation
  if (quotationId !== "newQuotation" && !quotationData)
    return <NoQuotation quotationId={quotationId as string} />
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader02 tagList={tagList}
        panelList={allowEdit ? panel_editable : panel_noEditable}
      />

      <div className={style.mainContainer}>
        <div className={style.quotation}>
          <QuotationProfile profileState={profileState} disabled={!allowEdit} />

          {/* 基本資料 */}
          <div className={style.switchBar}>
            <div className={style.active}>
              合約項目
            </div>
          </div>

          {/* 主產品設定 */}
          <QuotationProduction productStates={prodStates} />

          <div className={style.redWrapper}>
            {/* 材料配件設定 */}
            <QuotationComponent
              partList={prodStates.productList[prodStates.activeRow]?.part}
              disabled={!allowEdit} />
            <hr />
            {/* 選配設定 */}
            <QuotationAccessory activeRow={prodStates.activeRow} />
          </div>

          {/* 備註/報價範圍/付款資訊 */}
          <QuotationTotal
            {...{
              remarkListState, rangeListState,
              payInfoState,
              disabled: !allowEdit,
              prodState: prodStates
            }}
          />
          {/* 簽名 */}
          <QuotationSinature sinatureState={sinatureState} disabled={!allowEdit} />


        </div>
      </div>
      <InputModal
        visible={showMemoModal}
        setVisible={setShowMemoModal}
        title={"請輸入註解"}
        placeholder={"註解"}
        onConfirm={inputModalOnConfirm}
        autoCloseOnConfirm={false}
      />
      <QuotationPdf isVisable={showPdf} onCancel={() => { setShowPdf(false) }} />
    </div>
  )

}


// ==========================================================================
// ==========================================================================
// ==========================================================================
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
// ==========================================================================
const QuotationStateSel = (
  { quotationState, setQuotationState, options }:
    {
      quotationState: Toption
      setQuotationState: Dispatch<SetStateAction<Toption>>
      options: Toption[]
    }
) => {

  const customStyleObj: TcusStyleObj = {
    menuList: {
      width: `180.375px`,
      position: "relative",
      right: "60.38px",
    },
    option: {
      textAlign: "center"
    }
  }

  const onChange = (option: Toption | null) => {
    setQuotationState(option!)
  }


  return (
    <div className={style.quotationState}>
      <div className={style.sel}>
        <span>狀態 : </span>
        <Select03 className={style.select03}
          stateValue={quotationState}
          options={options}
          onChange={onChange}
          customStyleObj={customStyleObj}
        />
      </div>
      {/* <div>
        <span>
          歷史狀態
        </span>
      </div> */}
    </div>
  )

}

