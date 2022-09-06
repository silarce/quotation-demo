import { useState } from "react";


// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"

// components
import BudgeList from "components/page/domestic/budget/budgeList"
import ContractList from "components/page/domestic/contract/contractList";

// css
import style from "./budget.module.scss"

// fakeData
import { fakeContractListSimple } from "fakeDatabase/domestic/contractCombinder"; 

// ===========================================
const panelList: TpanelList = [{
  type: "addButton",
  label: "待變更介面",
  onClick: () => alert("test")
}]


// ===========================================

export default function Contract() {

  // ===================================================

  // ===================================================

  return (
    <div className={style.container}>
      {/* header panel */}
      <PageHeader02 tag="合約" panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <ContractList contractList={fakeContractListSimple} />
      </div>
    </div>
  )
}