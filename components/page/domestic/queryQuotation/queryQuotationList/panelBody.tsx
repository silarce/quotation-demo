

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar";

import { IconDetail } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "../queryQuotationList.module.scss"

// type
import { TqueryQuotation } from 'pages/domestic/queryQuotation';





export default function PanelBody({ stepList }:
  { stepList: TqueryQuotation["stepList"] }) {

  const onClick = () => {
    alert("目前無功能")
  }

  return (
    <div className={style.panelBody}>
      {stepList.map((item, index) => {
        if (index === 0) return null
        const { step, date, clientName } = item
        return (
          <CellWithBar className={style.row} key={index}>
            <span></span>
            <span className={style.step}>{step}</span>
            <span>{date}</span>
            <span className={style.clientName}>{clientName}</span>
            <span></span>
            <span></span>
            <div><IconDetail onClick={onClick} /></div>
          </CellWithBar>
        )
      })}
    </div>
  )
}