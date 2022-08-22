import { useRouter } from "next/router"


// components
import QuotationProfile from "components/page/domestic/contract/quotation/quotationProfile"

// global gear
import PageHeader02, { TtagList, TpanelList } from "components/PageHeader/pageHeader02"



// css
import style from "./[quotation].module.scss"







export default function Quotation() {

  const router = useRouter()
  const { quotation } = router.query

  // =========================================================
  const tagList: TtagList = [
    { label: `報價編號 ${quotation}`, onClick: () => alert(quotation) },
    { label: "工程聯絡單", onClick: () => alert("工程聯絡單") },
  ]
  const panelList: TpanelList = [
    { type: "redButton", label: "上傳", onClick: () => alert("上傳") },
    { type: "myButton", label: "取消", onClick: () => router.back() },
  ]
  // =========================================================

  return (
    <div>

      <PageHeader02 tagList={tagList} panelList={panelList} />

      <div className={style.mainContainer}>


        <div> {/* scroll wrapper */}
          <QuotationProfile />


          {/* <p>合約項目</p> */}
          {/* <div></div> */}
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