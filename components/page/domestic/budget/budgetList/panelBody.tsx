import { MouseEvent } from "react";

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar";

import { IconDetail } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "../budgetList.module.scss"

//  type
import { TbudgetDetail } from 'fakeDatabase/domestic/budget/fakeBudgetListGroup';






export default function PanelBody(
  { budgetDetail,
    openQuotation
  }:
    {
      budgetDetail: TbudgetDetail[]
      openQuotation: (e: MouseEvent) => void
    }
) {



  return (
    <div className={style.panelBody}>
      {budgetDetail.map((item, index) => {
        const { date, describe, discount, doorQty } = item
        let { contractAmount } = item
        if (typeof contractAmount === "string") {
          contractAmount = parseFloat(contractAmount)
        }
        contractAmount = contractAmount.toLocaleString()

        return (
          <CellWithBar className={style.detailRow} key={index}>
            <span>{date}</span>
            <span>{describe}</span>
            <span>{discount}</span>
            <span>{doorQty}</span>
            <span>{contractAmount}</span>
            <div><IconDetail onClick={openQuotation} /></div>
          </CellWithBar>
        )
      })}
    </div>
  )
}