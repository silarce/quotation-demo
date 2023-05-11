// 報價單
import React, {
  Dispatch, SetStateAction, FocusEvent,
  useState, useRef, useEffect
} from "react"
import { useRouter } from "next/router"
import { NextRouter } from "next/router"

// layer
import SubLayer from "components/Layer/SubLayer/SubLayer"


// components
import QuotationProfile from "components/page/domestic/quotation/quotationProfile"
import QuotationProduction from "components/page/domestic/quotation/quotationProduct"
import QuotationOtherSetting from "components/page/domestic/quotation/quotationOtherSetting"
import QuotationComponent from "components/page/domestic/quotation/quotationComponent"
import QuotationAccessory from "components/page/domestic/quotation/quotationAccessory"
import QuotationTotal from "components/page/domestic/quotation/quotationTotal"
import QuotationSinature from "components/page/domestic/quotation/quotationSinature"

import QuotationPdf from "components/page/domestic/pdf/quotationPdf/quotationPdf"
import QuotationPdf_part from "components/page/domestic/pdf/quotationPdf_part/quotationPdf_part"

// global gear
import PageHeader02, { TtagList, TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import InputSel from "components/global/gear/inputAndSel/inputSel"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"
import TextareaModal from "components/global/gear/modal/simpleModal/textareaModal";

// icon
import iconUpload from "public/image/icon/upload.svg"

// option
import { optionsCreator_quotationState, Toption } from "fakeDatabase/options/options"
const optionQuotationState = optionsCreator_quotationState()

// css
import style from "./quotation.module.scss"
// ========================================================================
import { fakeApi_legacyQuotation_creator } from "fakeDatabase/fakeAPI/fakeLegacyQuotationApi"
import { useLegacyQuotation } from "hooks/quotation/useLegacyQuotation"
import { fakeApi_client } from "fakeDatabase/fakeAPI/fakeClientApi";
import { fakeApi_memo } from "fakeDatabase/fakeAPI/fakeMemoApi";
import { fakeApi_quoteRange } from "fakeDatabase/fakeAPI/fakeQuoteRangeApi";
// ========================================================================
// ========================================================================
// ========================================================================

export default function Quotation() {
  const router = useRouter()
  const isReady = router.isReady

  if (!isReady) return null

  return <TheQuotation router={router} />
}

function TheQuotation({ router }: { router: NextRouter }) {

  let {
    quotationId, //報價單id //若為新增報價單則為newQuotation
    isNewQuotationId, // 新增報價單的id // 若不是新增報價單則為undefined
  } = router.query

  // --------------------------------------------------------------------------
  const [allowEdit, setAllowEdit] = useState(false)
  // --------------------------------------------------------------------------
  const fakeApiQuotaion = fakeApi_legacyQuotation_creator(router.query.quotationId as string)

  const { classQuotation, reNew: reNewClassQuotation } = useLegacyQuotation(fakeApiQuotaion?.get())
  const fakeClientList = fakeApi_client.get()
  const classSignature = classQuotation?.classSignature
  const signatureArr = [
    {
      label: "經理",
      signature: classSignature?.manager ?? "",
      onChange: (v: string) => { if (classSignature) classSignature.manager = v },
    },
    {
      label: "主管",
      signature: classSignature?.director ?? "",
      onChange: (v: string) => { if (classSignature) classSignature.director = v },
    },
    {
      label: "經辦",
      signature: classSignature?.attn ?? "",
      onChange: (v: string) => { if (classSignature) classSignature.attn = v },
    },
  ]

  const getFakeMemo = fakeApi_memo.get
  const getFakeQuotaRange = fakeApi_quoteRange.get

  useEffect(() => {
    reNewClassQuotation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowEdit])

  // -----------------------------------------------------------------------
  const [showPdf, setShowPdf] = useState(false)
  const [showPdf_part, setShowPdf_part] = useState(false)
  // -----------------------------------------------------------------------



  // -----------------------------------------------------------------------
  const tagList: TtagList = [
    {
      label: `報價編號 ${quotationId}`,
      onClick: () => alert(quotationId)
    },
    { label: "工程聯絡單", onClick: () => alert("工程聯絡單") },
  ]

  // optionQuotationState
  const panel_editable: TpanelList = [
    { type: "redButton", label: "上傳", onClick: () => { alert("上傳") } },
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

  // -----------------------------------------------------------------------
  if (!classQuotation) return null
  // -----------------------------------------------------------------------
  const quotationPdf_part_mainProductArr = (() => {
    const theArr = classQuotation.mainProductArr.map((mp) => {
      return {
        ...mp.allData,
        part: mp.partArr.map((part) => part.allData)
      }
    })
    return theArr
  })()
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  return (
    <SubLayer>

      <PageHeader02 tagList={tagList}
        panelList={allowEdit ? panel_editable : panel_noEditable}
      />

      <div>
        <div className={style.quotation}>
          {/* 基本資料 */}
          <QuotationProfile
            classBasicInfo={classQuotation.classBasicInfo}
            fakeClientList={fakeClientList}
            disabled={!allowEdit} />
          {/*  */}
          <div className={style.switchBar}>
            <div className={style.active}>
              合約項目
            </div>
          </div>
          {/* 主產品設定 */}
          <QuotationProduction classQuotation={classQuotation} disabled={!allowEdit} />
          {/* 其他設定 */}
          <QuotationOtherSetting classQuotation={classQuotation} disabled={!allowEdit} />
          {/* 備註/報價範圍/付款資訊 */}
          <QuotationTotal
            classQuotation={classQuotation}
            getFakeMemo={getFakeMemo}
            getFakeQuotaRange={getFakeQuotaRange}
            disabled={!allowEdit}
          />




          {/*  */}
          {/*  */}
          {/*  */}
          <QuotationSinature
            signatureArr={signatureArr}
            disabled={!allowEdit} />


        </div>
      </div>


    </SubLayer>
  )

}








