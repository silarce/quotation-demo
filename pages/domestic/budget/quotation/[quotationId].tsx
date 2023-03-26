// 報價單
import React, {
  Dispatch, SetStateAction, FocusEvent,
  useState, useMemo, useRef, useEffect
} from "react"
import { useRouter } from "next/router"
import { NextRouter } from "next/router"

import Select from 'react-select';
import type { GroupBase, } from 'react-select';


// components
import QuotationProfile from "components/page/domestic/quotation/quotationProfile"
import QuotationProduction from "components/page/domestic/quotation/quotationProduct"
import QuotationComponent from "components/page/domestic/quotation/quotationComponent"
import QuotationAccessory from "components/page/domestic/quotation/quotationAccessory"
import QuotationTotal from "components/page/domestic/quotation/quotationTotal"
import QuotationSinature from "components/page/domestic/quotation/quotationSinature"
import QuotationProdChangingRecord from "components/page/domestic/quotation/quotationProdChangingRecord"
import QuotationRecord from "components/page/domestic/quotation/quotationRecord"
import QuotationPdf from "components/page/domestic/pdf/quotationPdf/quotationPdf"
import QuotationPdf_part from "components/page/domestic/pdf/quotationPdf_part/quotationPdf_part"

// antd
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space } from 'antd';

// global gear
import PageHeader02, { TtagList, TpanelList } from "components/PageHeader/pageHeader02"
import { RotatingArrow01 } from 'public/image/icon/iconComponent/rotatingArrow';
import Select03, { TcusStyleObj } from "components/global/gear/select/select03"
import InputModal from "components/global/gear/modal/simpleModal/inputModal"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"
import TextareaModal from "components/global/gear/modal/simpleModal/textareaModal";



// icon
import iconUpload from "public/image/icon/upload.svg"

// option
import { optionsCreator_quotationState, Toption } from "fakeDatabase/options/options"
const optionQuotationState = optionsCreator_quotationState()

// css
import style from "./quotation.module.scss"



// // fakeData type
// import { Tquotation, fakeQuotationObjListOri } from "fakeDatabase/domestic/quotation/fakeQuotationList"
// // 生成假資料
// const fakeQuotationObjList = fakeQuotationObjListOri()


// =============================================================
// =============================================================
// =============================================================
// =============================================================
import { fakeApi_quotation_creator } from "fakeDatabase/fakeAPI/fakeQuotationApi";
import { useQuotation } from "hooks/quotation/useQuotation";
import { fakeApi_client } from "fakeDatabase/fakeAPI/fakeClientApi";
import { fakeApi_memo } from "fakeDatabase/fakeAPI/fakeMemoApi";
import { fakeApi_quoteRange } from "fakeDatabase/fakeAPI/fakeQuoteRangeApi";
// =============================================================
// =============================================================
// =============================================================
// =============================================================
// =============================================================






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
    isNewQuotationId, // 新增報價單的id // 若不是新增報價單則為undefined
  } = router.query


  // =========================================================
  // =========================================================
  // =========================================================

  // 正式接上api前先這樣處理，但是我已經忘記這是在處理什麼了.....
  // let quotationData: Tquotation | undefined;
  // if (typeof quotationId === "string" && quotationId !== "newQuotation") {
  //   quotationData = fakeQuotationObjList[quotationId]
  //   if (!quotationData) quotationData = undefined
  // }
  // --------------------------------------------------------------------------
  // 是否可編輯
  // const [allowEdit, setAllowEdit] =
  //   useState(quotationId === "newQuotation" ? true : false)
  const [allowEdit, setAllowEdit] = useState(false)
  // =========================================================
  const fakeApiQuotaion = fakeApi_quotation_creator(router.query.quotationId as string)

  const { classQuotation, reNew: reNewClassQuotation } = useQuotation(fakeApiQuotaion?.get())
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


  // =========================================================
  // =========================================================
  // =========================================================
  // =========================================================

  // --------------------------------------------------------------------------

  const [showPdf, setShowPdf] = useState(false)
  const [showPdf_part, setShowPdf_part] = useState(false)

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  const [quotationState, setQuotationState] = useState<Toption>({ value: "預算", label: "預算" })

  const [showMemoModal, setShowMemoModal] = useState(false)
  const inputModalOnConfirm = (v: string) => {
    if (!fakeApiQuotaion || !classQuotation) return myAlert.warning({ title: "fakeApiQuotaion或classQuotation為undefined" })
    if (!v) return myAlert.warning({ title: "請輸入註解" })
    if (isNewQuotationId) fakeApiQuotaion.post(classQuotation.postData)
    else fakeApiQuotaion.put(classQuotation.postData)
    setShowMemoModal(false)
    setAllowEdit(false)
  }

  const tagList: TtagList = [
    {
      label: `報價編號 ${quotationId}`,
      onClick: () => alert(quotationId)
    },
    { label: "工程聯絡單", onClick: () => alert("工程聯絡單") },
  ]

  // optionQuotationState
  const panel_editable: TpanelList = [
    {
      // 報價/歷史狀態狀態
      custom: <QuotationStateSel
        quotationState={quotationState}
        setQuotationState={setQuotationState}
        options={optionQuotationState}
      />
    },
    { type: "redButton", label: "上傳", onClick: () => setShowMemoModal(true) },
    { type: "myButton", label: "取消", onClick: () => setAllowEdit(false) },
  ]
  const panel_noEditable: TpanelList = [
    {
      type: "myButton", label: "匯出報價單", img: iconUpload.src,
      onClick: () => setShowPdf(true)
    },
    {
      type: "myButton", label: "匯出材料/配件", img: iconUpload.src,
      onClick: () => setShowPdf_part(true)
    },
    { type: "myButton", label: "編輯", onClick: () => setAllowEdit(true) },
    { type: "myButton", label: "送審", onClick: () => alert("送審") },
    { type: "myButton", label: "返回", onClick: () => router.back() },
  ]

  // --------------------------------------------------------------------------
  // 如果報價單編號錯誤(找不到這筆報價單)，就return NoQuotation
  // if (quotationId !== "newQuotation" && !quotationData)
  //   return <NoQuotation quotationId={quotationId as string} />
  // if (quotationId !== "newQuotation")
  //   return <NoQuotation quotationId={quotationId as string} />
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  if (!classQuotation) return null
  // --------------------------------------------------------------------------
  const quotationPdf_part_mainProductArr = (() => {
    const theArr = classQuotation.mainProductArr.map((mp) => {
      return {
        ...mp.allData,
        part: mp.partArr.map((part) => part.allData)
      }
    })
    return theArr
  })()
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
          <QuotationProfile
            classBasicInfo={classQuotation.classBasicInfo}
            fakeClientList={fakeClientList}
            disabled={!allowEdit} />

          {/* 基本資料 */}
          <div className={style.switchBar}>
            <div className={style.active}>
              合約項目
            </div>
          </div>

          {/* 主產品設定 */}
          <QuotationProduction classQuotation={classQuotation} disabled={!allowEdit} />

          <div className={style.redWrapper}>
            {/* 材料配件設定 */}
            <QuotationComponent classQuotation={classQuotation} disabled={!allowEdit} />
            <hr />
            {/* 選配設定 */}
            <QuotationAccessory activeRow={classQuotation.activeMainProd} />
          </div>

          {/* 備註/報價範圍/付款資訊 */}
          <QuotationTotal
            classQuotation={classQuotation}
            getFakeMemo={getFakeMemo}
            getFakeQuotaRange={getFakeQuotaRange}
            disabled={!allowEdit}
          />
          {/* 簽名 */}
          <QuotationSinature
            signatureArr={signatureArr}
            disabled={!allowEdit} />
        </div>
      </div>
      <TextareaModal
        visible={showMemoModal}
        setVisible={setShowMemoModal}
        title={"追加追減備註"}
        placeholder={"請輸入備註"}
        tip="最多25字"
        textLength={25}
        onConfirm={inputModalOnConfirm}
        autoCloseOnConfirm={false}
      />
      <QuotationPdf
        isVisable={showPdf}
        onCancel={() => { setShowPdf(false) }}
        classQuotation={classQuotation} />

      {/*  */}
      <QuotationPdf_part
        isVisable={showPdf_part}
        onCancel={() => { setShowPdf_part(false) }}
        mainProductArr={quotationPdf_part_mainProductArr}
        quotationId={classQuotation.quotationId}
      />
      {/*  */}
    </div>
  )
}

// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
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
// ==========================================================================
// ==========================================================================
// 報價/歷史狀態狀態
const QuotationStateSel = (
  { quotationState, setQuotationState, options }:
    {
      quotationState: Toption
      setQuotationState: Dispatch<SetStateAction<Toption>>
      options: Toption[]
    }
) => {
  // -------------------------------------------------------------------------
  // 報價狀態
  const [isFocus, setIsFocus] = useState("")
  const [selIsOpen, setSelIsOpen] = useState<boolean | undefined>(undefined)

  const customStyleObj: TcusStyleObj = {
    menu: {
      width: `172.38px`,
      position: "relative",
      right: "92px",
      top: "3px",
    },
    menuList: {
      width: "100%",
    },
    option: {
      textAlign: "center"
    },
  }

  const onChange = (option: Toption | null) => {
    setQuotationState(option!)
    setIsFocus("")
    setSelIsOpen(undefined)
  }
  const onFocus = (e?: FocusEvent<HTMLInputElement>) => {
    setIsFocus(style.isFocus)
  }
  const onBlur = () => {
    setIsFocus("")
    setSelIsOpen(undefined)
  }
  // --------------------------------------------------------------
  // 歷史狀態
  const [showHistory, setShowHistory] = useState("")
  const historyRef = useRef<HTMLDivElement>(null!)
  const historyListRef = useRef<HTMLDivElement>(null!)
  const selRef = useRef<HTMLDivElement>(null!)

  const closeHistoryList = (e: MouseEvent) => {

    if (historyRef.current.contains(e.target as Node)) return
    if (historyListRef.current.contains(e.target as Node)) return

    setShowHistory("")
    document.removeEventListener('mousedown', closeHistoryList)
  }
  const openHistoryList = () => {
    setShowHistory(style.isShow)
    document.addEventListener('mousedown', closeHistoryList)
  }
  // --------------------------------------------------------------
  return (
    <div className={style.quotationState}>
      <div className={`${style.sel} ${isFocus}`}
        onClick={() => selRef.current.focus()}
      >
        <span>報價狀態 : </span>
        <Select03 className={style.select03}
          stateValue={quotationState}
          options={options}
          onChange={onChange}
          customStyleObj={customStyleObj}
          onFocus={onFocus}
          onBlur={onBlur}
          selRef={selRef}
          openMenuOnFocus={true}
        />
      </div>

      <div className={style.history} ref={historyRef}
        onClick={openHistoryList}>
        <span>
          歷史狀態
        </span>
      </div>

      <div className={`${style.historyList} ${showHistory}`} ref={historyListRef}
      >
        <div className={style.item}>
          <div><span>{"預算 > 投標"}</span></div>
          <div>
            <span>111-02-03</span>
            <span>10:23:30</span>
          </div>
        </div>
        <hr />
        <div className={style.item}>
          <div><span>{"預算 > 發包"}</span></div>
          <div>
            <span>111-02-03</span>
            <span>10:23:30</span>
          </div>
        </div>
        <hr />
        <div className={style.item}>
          <div><span>{"預算 > 發包"}</span></div>
          <div>
            <span>111-02-03</span>
            <span>10:23:30</span>
          </div>
        </div>
        <hr />
        <div className={style.item}>
          <div><span>{"預算 > 投標"}</span></div>
          <div>
            <span>111-02-03</span>
            <span>10:23:30</span>
          </div>
        </div>
        <hr />
      </div>

    </div >
  )
}
