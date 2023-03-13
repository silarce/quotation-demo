import { MouseEvent } from "react";

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar";

import { IconDetail } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "../budgetList.module.scss"


import { Class_fakeApi_projectSimple } from 'fakeDatabase/fakeAPI/fakeProjectSimpleApi';
type TprojectSimpleRecord = ReturnType<Class_fakeApi_projectSimple['get']>[0]["tempRecord"];


export default function PanelBody(
  { projectSimpleRecord: projectRecord,
    openQuotation
  }:
    {
      projectSimpleRecord: TprojectSimpleRecord
      openQuotation: (e: MouseEvent) => void
    }
) {


  return (
    <div className={style.panelBody}>
      {projectRecord.map((item, index) => {
        const { date, Remark, discount, doorQty, budgetAmount } = item

        let formatedBudgetAmount: string | number = budgetAmount
        if (typeof formatedBudgetAmount === "string") {
          formatedBudgetAmount = parseFloat(formatedBudgetAmount)
        }
        formatedBudgetAmount = formatedBudgetAmount.toLocaleString()

        return (
          <CellWithBar className={style.detailRow} key={index}>
            <span>{date}</span>
            <span>{Remark}</span>
            <span>{discount}</span>
            <span>{doorQty}</span>
            <span>{formatedBudgetAmount}</span>
            <div><IconDetail onClick={openQuotation} /></div>
          </CellWithBar>
        )
      })}
    </div>
  )
}