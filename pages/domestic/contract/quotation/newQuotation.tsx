import { useRouter } from "next/router"


// components
import QuotationProfile from "components/page/domestic/contract/quotation/quotationProfile"
import QuotationProduction from "components/page/domestic/contract/quotation/quotationProduct"
import QuotationComponent from "components/page/domestic/contract/quotation/quotationComponent"
import QuotationAccessory from "components/page/domestic/contract/quotation/quotationAccessory"
import QuotationTotal from "components/page/domestic/contract/quotation/quotationTotal"
// global gear
import PageHeader02, { TtagList, TpanelList } from "components/PageHeader/pageHeader02"

// hook
import useProfile from "components/page/domestic/contract/quotation/hook/useProfile"
import useProduct from "components/page/domestic/contract/quotation/hook/useProduct"
import useMemoList from "components/page/domestic/contract/quotation/hook/useMemoList"
// css
import style from "./[quotation].module.scss"

// fakeData
import fakeQuotationData from "meta/fakeData/fakeQuotation"





export default function Quotation() {

  const router = useRouter()
  const { newQuotatinId } = router.query

  // =========================================================
  // profile
  const stateQuotation = useProfile(fakeQuotationData.profile)
  if (stateQuotation.quotation.quotationId === "" && typeof newQuotatinId === "string") {
    stateQuotation.setQuotation.setQuotationId(newQuotatinId)
  }

  // product
  const productStates = useProduct(fakeQuotationData.productList)

  // memo
  const memoListState = useMemoList(fakeQuotationData)

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
          <QuotationProduction productStates={productStates} />

          <div className={style.redWrapper}>
            {/* 材料配件設定 */}
            <QuotationComponent productStates={productStates} />
            <hr />
            <QuotationAccessory productStates={productStates} />
          </div>
          <QuotationTotal memoListState={memoListState} />



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




