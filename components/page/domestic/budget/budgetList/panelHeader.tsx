import { MouseEvent } from 'react'

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar";

// css
import style from "../budgetList.module.scss"

// icon
import iconPlace from "public/image/icon/place.svg"
import { IconDetail } from "public/image/icon/svgComponent/svgIcons"


import { Class_fakeApi_projectSimple } from 'fakeDatabase/fakeAPI/fakeQuotationSimpleArrApi';
type TprojectSimple = ReturnType<Class_fakeApi_projectSimple['get']>[0];

export default function PanelHeader({ projectData: projectData, isActive, openQuotation }:
  {
    projectData: TprojectSimple
    isActive: boolean
    openQuotation: (e: MouseEvent) => void
  }) {

  const {
    quotationId,
    constructionName: projectName,
    undertaker, totalDiscount: discount,
    clientData,
    tempDoorQty: doorQty,
    tempBudgetAmount: budgetAmount,
    date,
    constructionCounty: country
  } = projectData

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
    <CellWithBar className={style.panelHeader} isActive={isActive}>
      <div className={style.row01}>
        <span>{quotationId}</span>
        <span className={style.clientName}>{clientName}</span>
        <span>{contactName}</span>
        <span>{contactPhone}</span>
        <span>{undertaker}</span>
        <span>{discount}</span>
        <span>{doorQty}</span>
        <span>{formatedBudgetAmount}</span>
        <div><IconDetail onClick={openQuotation} /></div>
      </div>
      <div className={style.row02}>
        <span>{date}</span>
        <div className={style.place}>
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconPlace.src} alt="place" />
          <span className={style.country}>{country}</span>
        </div>
        <span>{projectName}</span>
        <div></div>
      </div>
    </CellWithBar>
  )
}

