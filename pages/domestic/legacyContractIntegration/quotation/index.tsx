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
// import QuotationProfile from "components/page/domestic/quotation/quotationProfile"
import QuotationProfile from "components/page/domestic/quotation/quotationProfile_legacyContract"
import QuotationProduction from "components/page/domestic/quotation/quotationProduct_legacyContract"
import QuotationAdditions from "components/page/domestic/quotation/quotationAdditions"
import QuotationTotal from "components/page/domestic/quotation/quotationTotal_legacyContract"
import QuotationSinature from "components/page/domestic/quotation/quotationSinature"

import QuotationPdf from "components/page/domestic/pdf/quotationPdf/quotationPdf"
import QuotationPdf_part from "components/page/domestic/pdf/quotationPdf_part/quotationPdf_part"

// global gear
import PageHeader02, { TtagList, TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"
// icon
import iconUpload from "public/image/icon/upload.svg"


// css
import style from "./quotation.module.scss"
// ========================================================================
import { fakeApi_legacyQuotation_creator } from "fakeDatabase/fakeAPI/fakeLegacyQuotationApi"
import { Class_legacyContract, useLegacyContract } from "hooks/quotation/useLegacyContract"
import { fakeApi_client } from "fakeDatabase/fakeAPI/fakeClientApi";
import { fakeApi_memo } from "fakeDatabase/fakeAPI/fakeMemoApi";
import { fakeApi_quoteRange } from "fakeDatabase/fakeAPI/fakeQuoteRangeApi";
// ========================================================================
// api

import { useLegacyContract_id } from "js/api/api_legacy-contract"
import { useCustomers, TapiGetCustomersParams } from "js/api/api_customer"






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

  /**合約id，若為undefined就逮代表為新增合約 */
  const contractId = router.query.contractId as string | undefined

  // --------------------------------------------------------------------------
  const [allowEdit, setAllowEdit] = useState(false)
  // --------------------------------------------------------------------------
  let [params, setParams] = useState<TapiGetCustomersParams>({
    page: 1,
    pageSize: 8,
    populate: ["contacts", "types"],
    // filter,
    sort: "customerNumber"
  })
  const { data: customerArr, update: updateCustomerArr } = useCustomers(params)
  // --------------------------------------------------------------------------

  const { legacyContract, updateLegacyContract, } = useLegacyContract_id(contractId)

  useEffect(() => {
    (async () => {
      await updateCustomerArr()
      await updateLegacyContract()
    })()

  }, [])

  const { classLegacyContract, rewind } = useLegacyContract(legacyContract)

  const classSignature = classLegacyContract?.classSignature
  const signatureArr = [
    {
      label: "經理",
      signature: classSignature?.managerName ?? "",
      onChange: (v: string) => { if (classSignature) classSignature.managerName = v },
    },
    {
      label: "主管",
      signature: classSignature?.supervisorName ?? "",
      onChange: (v: string) => { if (classSignature) classSignature.supervisorName = v },
    },
    {
      label: "經辦",
      signature: classSignature?.operatorName ?? "",
      onChange: (v: string) => { if (classSignature) classSignature.operatorName = v },
    },
  ]

  // const getFakeMemo = fakeApi_memo.get
  // const getFakeQuotaRange = fakeApi_quoteRange.get

  useEffect(() => {
    1
    rewind()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowEdit])

  // -----------------------------------------------------------------------
  const [showPdf, setShowPdf] = useState(false)
  const [showPdf_part, setShowPdf_part] = useState(false)

  // -----------------------------------------------------------------------
  const tagList: TtagList = [
    {
      label: `報價編號 ${classLegacyContract.classBasicInfo.contractNumber}`,
      onClick: () => { }
    },
    // { label: "工程聯絡單", onClick: () => alert("工程聯絡單") },
  ]

  // optionQuotationState
  const panel_editable: TpanelList = [
    {
      type: "redButton", label: "上傳", onClick: () => {
        // if (!fakeApiQuotaion || !classQuotation) return myAlert.warning({ title: "fakeApiQuotaion或classQuotation為undefined" })
        // if (isNewQuotationId) fakeApiQuotaion.post(classQuotation.postData)
        // else fakeApiQuotaion.put(classQuotation.postData)
        setAllowEdit(false)
      }
    },
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
  if (!classLegacyContract) return null
  // -----------------------------------------------------------------------
  // const quotationPdf_part_mainProductArr = (() => {
  //   const theArr = classQuotation.classProductArr.map((mp) => {
  //     return {
  //       ...mp.allData,
  //       part: mp.partArr.map((part) => part.allData)
  //     }
  //   })
  //   return theArr
  // })()
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
            classLegacyContract={classLegacyContract}
            classBasicInfo={classLegacyContract.classBasicInfo}
            customerArr={customerArr ?? []}
            disabled={!allowEdit} />
          {/*  */}
          <div className={style.switchBar}>
            <div className={style.active}>
              合約項目
            </div>
          </div>
          {/* 主產品設定 */}
          <QuotationProduction legacyContract={classLegacyContract} disabled={!allowEdit} />
          {/* 其他設定 */}
          <QuotationAdditions legacyContract={classLegacyContract} disabled={!allowEdit} />
          {/* 備註/報價範圍/付款資訊 */}
          <QuotationTotal
            legacyContract={classLegacyContract}
            disabled={!allowEdit}
          />
          {/* 簽名 */}
          {/* <QuotationSinature
            signatureArr={signatureArr}
            disabled={!allowEdit} /> */}
        </div>
      </div>
      {/* <QuotationPdf
        isVisable={showPdf}
        onCancel={() => { setShowPdf(false) }}
        classQuotation={classQuotation} /> */}
    </SubLayer>
  )
}

// ============================================================================
/**
代辦事項

客戶名單有數千筆，要選擇客戶時要怎麼呈現?
還有客戶名單的搜尋功能要記得做


 */







