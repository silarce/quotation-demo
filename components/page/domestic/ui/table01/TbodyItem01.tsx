import { MouseEvent } from 'react'
import classNames from 'classnames';
import Image from 'next/image';

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar";

// icon
import iconPlace from "public/image/icon/place.svg"
import { IconDetail } from "public/image/icon/svgComponent/svgIcons"
import iconLongArrow from "public/image/icon/longArrow.svg"

// css
import scss from "./tbodyItem01.module.scss"

// =================================================================
// type
type Tdata = {
  basicInfo: {
    quotationId: string
    constructionName: string
    undertaker: string
    totalDiscount: string | number
    tempDoorQty: string | number
    tempBudgetAmount: string | number
    date: string
    constructionCounty: string
  }
  clientData: {
    name: string
    contact: { name: string, phone: string }[]
  }
}

// =============================================================================
export default function TbodyItem01(
  { projectData: projectData, isActive, openQuotation, approvalsStatus }:
    {
      // projectData: TprojectSimple
      projectData: Tdata
      isActive: boolean
      openQuotation: (e: MouseEvent) => void
      approvalsStatus?: string
    }) {



  const {
    quotationId,
    constructionName: projectName,
    undertaker, totalDiscount: discount,
    tempDoorQty: doorQty,
    tempBudgetAmount: budgetAmount,
    date,
    constructionCounty: country
  } = projectData.basicInfo
  const clientData = projectData.clientData

  const {
    name: clientName,
    contact
  } = clientData
  const {
    name: contactName,
    phone: contactPhone,
  } = contact[0]


  let formatedBudgetAmount: string | number = budgetAmount
  if (typeof formatedBudgetAmount === "string") {
    formatedBudgetAmount = parseFloat(formatedBudgetAmount)
  }
  formatedBudgetAmount = formatedBudgetAmount.toLocaleString()

  return (
    <CellWithBar className={scss.panelHeader} isActive={isActive}>
      <div className={scss.row01}>
        <span>{quotationId}</span>
        <span className={scss.clientName}>{clientName}</span>
        <span>{contactName}</span>
        <span>{contactPhone}</span>
        <span>{undertaker}</span>
        <span>{discount}</span>
        <span>{doorQty}</span>
        <span>{formatedBudgetAmount}</span>
        <div><IconDetail onClick={openQuotation} /></div>
      </div>

      <div className={scss.row02}>
        <span>{date}</span>
        <div className={scss.place}>
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconPlace.src} alt="place" />
          <span className={scss.country}>{country}</span>
        </div>
        <span>{projectName}</span>
        <div></div>
      </div>
      {approvalsStatus && <Row03 approvalsStatus={approvalsStatus} />}

    </CellWithBar>
  )
}


// =========================================================
const Row03 = (
  { approvalsStatus }:
    { approvalsStatus: string }
) => {


  const name = approvalsStatus === "待審核" ? "尚未選擇" : "Andy"

  return (
    <div className={scss.row03}>

      <div className={classNames(scss.step, scss.success)
      }>
        <div className={classNames(scss.spot)} />
        <span>Tommy</span>
      </div>
      <Image src={iconLongArrow} alt="to" />
      <div className={
        classNames(scss.step,
          { [scss.success]: approvalsStatus === "審核完成" },
          { [scss.notSuccess]: approvalsStatus === "審核中" },
        )
      }>
        <div className={classNames(scss.spot, scss.success)} />
        <span>{name}</span>
      </div>
    </div >
  )
}