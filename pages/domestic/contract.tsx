import { useState } from "react";


// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"

// components
import BudgeList from "components/page/domestic/budget/budgeList"
import ContractList from "components/page/domestic/contract/contractList";

// css
import style from "./budget.module.scss"

// fakeData
import fakeContractList, { TcontractList } from "meta/fakeData/fakeContractList";


// ===========================================
const panelList: TpanelList = [{
  type: "addButton",
  label: "新增報價單",
  onClick: () => alert("test")
}]


// ===========================================

export default function Budget() {

  // data



  // ===================================================

  // ===================================================

  return (
    <div className={style.container}>
      {/* header panel */}
      <PageHeader02 tag="合約" panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <ContractList contractList={fakeContractList} />
      </div>
    </div>
  )




}