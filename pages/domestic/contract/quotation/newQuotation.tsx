import { useEffect } from "react"
import { useRouter } from "next/router"


// components
import QuotationProfile from "components/page/domestic/contract/quotation/quotationProfile"
import QuotationProduction from "components/page/domestic/contract/quotation/quotationProduction"

// global gear
import PageHeader02, { TtagList, TpanelList } from "components/PageHeader/pageHeader02"

// hook
import useQuotation from "components/page/domestic/contract/quotation/hook/useQuotation"


// css
import style from "./[quotation].module.scss"







export default function Quotation() {

  const router = useRouter()
  const { newQuotatinId } = router.query

  // =========================================================
  const stateQuotation = useQuotation()
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
    <div>

      <PageHeader02 tagList={tagList} panelList={panelList} />

      <div className={style.mainContainer}>


        <div className={style.quotation}> {/* scroll wrapper */}
          <QuotationProfile stateQuotation={stateQuotation} />

          <h5 className={style.titleHr}>合約項目</h5>

          <QuotationProduction />



          {/* <div>
          <div></div>
          <div></div>
        </div> */}
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