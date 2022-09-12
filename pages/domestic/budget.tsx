import { useState } from 'react'
import { useRouter } from "next/router";


// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"

// components
import BudgeList from "components/page/domestic/budget/budgetList"
import HeaderPanel from "components/page/domestic/budget/headerPanel";

// css
import style from "./budget.module.scss"

// fakeData
import { fakeBudgetListGroup } from 'fakeDatabase/domestic/budget/fakeBudgetListGroup';


// ===========================================
// type
interface TsearchOnj {
  doorType: string
  country: string
  clientName: string
  projectName: string
}
// ===========================================

export default function Budget() {
  const router = useRouter()
  const { fakeBudgetList } = fakeBudgetListGroup
  // ===================================================

  const [searchObj, setSearchObj] = useState({
    doorType: "",
    country: "",
    clientName: "",
    projectName: "",
  })



  const panelList: TpanelList = [
    { custom: <HeaderPanel setSearchObj={setSearchObj} /> },
    {
      type: "addButton",
      label: "新增報價單",
      onClick: () => {
        let newQuotationId = `${fakeBudgetList.length + 1}`.padStart(2, "0")
        newQuotationId = "S-110211-" + newQuotationId
        router.push({
          pathname: `/domestic/contract/quotation/newQuotation`,
          query: { newQuotationId }
        })
      }
    },
  ]

  // ===================================================

  return (
    <div className={style.container}>
      {/* header panel */}
      <PageHeader02 tag="預算" panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <BudgeList budgetList={fakeBudgetList} searchObj={searchObj} />
      </div>
    </div>
  )
}

// ==========================================================
