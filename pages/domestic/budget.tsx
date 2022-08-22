import { useRouter } from "next/router";


// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"

// components
import BudgeList from "components/page/domestic/budget/budgeList"


// css
import style from "./budget.module.scss"

// fakeData
import fakeContractList, { TcontractList } from "meta/fakeData/fakeContractList";


// ===========================================


// ===========================================

export default function Budget() {

  const router = useRouter()
  // ===================================================

  const panelList: TpanelList = [{
    type: "addButton",
    label: "新增報價單",
    onClick: () => {
      let newQuotatinId = `${fakeContractList.length + 1}`.padStart(2, "0")
      newQuotatinId = "S-110211-" + newQuotatinId

      router.push({
        pathname: `/domestic/contract/quotation/newQuotation`,
        query: { newQuotatinId }
      })
    }
  }]



  // ===================================================

  return (
    <div className={style.container}>
      {/* header panel */}
      <PageHeader02 tag="預算" panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <BudgeList contractList={fakeContractList} />
      </div>
    </div>
  )




}