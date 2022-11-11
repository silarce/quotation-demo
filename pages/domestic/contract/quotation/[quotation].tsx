
import { useState, useMemo } from "react"
import { useRouter } from "next/router"
import { NextRouter } from "next/router"

// components
import QuotationProfile from "components/page/domestic/contract/quotation/quotationProfile"
import QuotationProduction from "components/page/domestic/contract/quotation/quotationProduct"
import QuotationComponent from "components/page/domestic/contract/quotation/quotationComponent"
import QuotationAccessory from "components/page/domestic/contract/quotation/quotationAccessory"
import QuotationTotal from "components/page/domestic/contract/quotation/quotationTotal"
import QuotationSinature from "components/page/domestic/contract/quotation/quotationSinature"
import QuotationProdChangingRecord from "components/page/domestic/contract/quotation/quotationProdChangingRecord"
import QuotationRecord from "components/page/domestic/contract/quotation/quotationRecord"

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse

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
import style from "./[quotation].module.scss"

// fakeData type
import { Tquotation, fakeQuotationObjListOri } from "fakeDatabase/domestic/quotation/fakeQuotationList"
import { fakeProdChangingRecordList } from "fakeDatabase/domestic/quotation/fakeChangeProductRecord"
// import { Tproduct, fakeQuotProductListOri, } from "fakeDatabase/domestic/quotation/fakeQuotProductionList"

// ========================================================
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
// ===========================================================
function TheQuotation({ router }: { router: NextRouter }) {
  // query
  // quotation為報價單的id，也可能是"newQuotation"字串
  // 如果quotation為報價單id，那newQuotationId應該會是undefined
  let {
    quotation, //報價單id //若為新增報價單則為newQuotation
    newQuotationId, // 新增報價單的id // 若不是新增報價單則為undefined
    isContract: isContractOri// 是否為從合約點進來的
  } = router.query

  if (typeof newQuotationId !== "string") newQuotationId = ""
  // 是否為從合約報表點進來的
  const isContract = isContractOri === "true" ? true : false

  // ======================================================

  // 正式接上api前先這樣處理
  let quotationData: Tquotation | undefined;
  if (typeof quotation === "string" && quotation !== "newQuotation") {
    quotationData = fakeQuotationObjList[quotation]
    if (!quotationData) quotationData = undefined
  }

  // =========================================================
  // 是否可編輯
  const [allowEdit, setAllowEdit] =
    useState(quotation === "newQuotation" ? true : false)

  // 合約項目 追加/追減項目的開關
  const [switch01, setSwitch01] = useState(true)

  // 展開版本追加追減紀錄的開關
  const [switch02, setSwitch02] = useState(false)

  // =========================================================
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
  // =========================================================
  // 追加追減項目
  const prodChangingRecord = useMemo(() => {
    if (typeof quotation === "string")
      return fakeProdChangingRecordList[quotation]
  }, [quotation])
  // =========================================================
  const [showPdf, setShowPdf] = useState(false)

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
    (isContract && {
      type: "myButton",
      label: "追加追減報價單",
      onClick: () => setSwitch02(state => !state)
    }) || null,
    {
      type: "myButton", label: "匯出報價單", img: iconUpload.src,
      onClick: () => setShowPdf(true)
    },
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
  // =========================================================
  return (
    <div className={style.container}>
      <PageHeader02 tagList={tagList}
        panelList={newQuotationId ? panel_newQuotation : panel_quotation}
      />
      {/*  */}
      <div className={style.mainContainer}>
        <div className={style.quotation}> {/* scroll wrapper */}
          {/* 工程名稱 */}
          <QuotationProfile profileState={profileState} disabled={!allowEdit} />
          {/*  */}

          <div className={style.switchBar}>
            {!switch02 &&
              <div className={(switch01 && style.active) || ""}
                onClick={() => setSwitch01(true)}>
                合約項目
              </div>
            }
            {isContract &&
              <div
                className={switch02 ? style.active
                  : !switch01 ? style.active
                    : ""}
                onClick={() => setSwitch01(false)}>
                追加 / 追減項目
              </div>}
          </div>
          {/* 合約項目 追加/追減項目 */}
          {
            (switch01 || switch02)
              ?
              <>
                {/* 合約項目 */}
                {/* 主產品設定 */}
                <QuotationProduction productStates={prodStates} switch02={switch02} />
                {/* 原報價項目 */}
                {switch02 &&
                  <OldQuotationProduction productStates={prodStates02} />
                }

                <div className={style.redWrapper}>
                  {/* 材料配件設定 */}
                  <QuotationComponent
                    partList={prodStates.productList[prodStates.activeRow]?.part}
                    disabled={!allowEdit} />
                  <hr />
                  {/* 選配設定 */}
                  <QuotationAccessory activeRow={prodStates.activeRow} />
                </div>

              </>
              // 追加/追減項目
              : <QuotationProdChangingRecord prodChangingRecord={prodChangingRecord} />
          }

          {/* 展開版本的追加追減紀錄 */}
          {prodChangingRecord && switch02 &&
            <QuotationRecord prodChangingRecord={prodChangingRecord} />}

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
      <QuotationPdf isVisable={showPdf} onCancel={() => { setShowPdf(false) }}

      />
    </div >
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

// =========================================================

// 暫時先註解掉
const OldQuotationProduction = ({ productStates }:
  { productStates: TuseProduct }) => {

  const [isActive, setIsActive] = useState(true)
  const panelSwitch = () => setIsActive(!isActive)


  return (
    <Collapse
      className={`${style.oldQuotationProduction}`}
      expandIcon={() => <></>}
      accordion={false}
      activeKey={+isActive}
    >
      <Panel key={0}
        header={<OqpHeader isActive={isActive} panelSwitch={panelSwitch} />}
      >
        <QuotationProduction
          className={style.quotationProduction}
          productStates={productStates} />
      </Panel>
    </Collapse>
  )
}

const OqpHeader = ({ isActive, panelSwitch }: {
  isActive: boolean
  panelSwitch: () => void
}) => {

  const active = isActive ? style.active : ""

  return (
    <div className={`${style.OqpHeader} ${active}`}>
      <span>原報價項目</span>
      <button className={style.panelButton} onClick={panelSwitch}>
        <span>展開</span>
        <RotatingArrow01 deg={0} defaultDeg={-180} isActive={!isActive} />
      </button>
    </div>
  )
}





// =========================================================

