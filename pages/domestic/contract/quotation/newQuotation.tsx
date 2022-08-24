import { useEffect } from "react"
import { useRouter } from "next/router"


// components
import QuotationProfile from "components/page/domestic/contract/quotation/quotationProfile"
import QuotationProduction from "components/page/domestic/contract/quotation/quotationProduct"
import QuotationMaterial from "components/page/domestic/contract/quotation/quotationMaterial"
// global gear
import PageHeader02, { TtagList, TpanelList } from "components/PageHeader/pageHeader02"

// hook
import useProfile from "components/page/domestic/contract/quotation/hook/useProfile"


// css
import style from "./[quotation].module.scss"







export default function Quotation() {

  const router = useRouter()
  const { newQuotatinId } = router.query

  // =========================================================
  const stateQuotation = useProfile()
  if (stateQuotation.quotation.quotationId === "" && typeof newQuotatinId === "string") {
    stateQuotation.setQuotation.setQuotationId(newQuotatinId)
  }


  // =========================================================
  const tagList: TtagList = [
    { label: `報價編號 ${newQuotatinId}`, onClick: () => alert(newQuotatinId) },
    { label: "工程聯絡單", onClick: () => alert("工程聯絡單") },
  ]
  const panelList: TpanelList = [
    { type: "redButton", label: "上傳", onClick: () => alert("上傳") },
    { type: "myButton", label: "取消", onClick: () => router.back() },
  ]
  // =========================================================
  if (!newQuotatinId) return null
  return (
    <div className={style.container}>

      <PageHeader02 tagList={tagList} panelList={panelList} />

      <div className={style.mainContainer}>
        <div className={style.quotation}> {/* scroll wrapper */}
          {/* 工程名稱 */}
          <QuotationProfile stateQuotation={stateQuotation} />
          {/*  */}
          <h5 className={style.titleHr}>合約項目</h5>
          {/* 主產品設定 */}
          <QuotationProduction />

          <div className={style.redWrapper}>
            {/* 材料配件設定 */}
            <QuotationMaterial />
            <hr />
            <div>
              <h1>test</h1><h1>test</h1><h1>test</h1>
            </div>
          </div>



          {/* <div></div> */}
          {/* <div>
          <div></div>
          <div></div>
        </div> */}
          {/* <div></div> */}
        </div>

      </div>



    </div>
  )
}