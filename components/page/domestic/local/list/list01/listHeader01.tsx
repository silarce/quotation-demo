
import { MouseEvent } from "react";

import { IconDetail } from "public/image/icon/svgComponent/svgIcons"

import style from "./listHeader01.module.scss"


// type
import { TfakeContractSimple } from "fakeDatabase/domestic/contractCombinder";



export default function ListHeader01(
  { className = "", contract, onClick, isActive }:
    {
      className?: string
      contract: TfakeContractSimple
      onClick: ((e: MouseEvent) => void) | (() => void)
      isActive?: boolean
    }) {

  const {
    quotationId: contractId, clientName, projectName,
    schedule, money, contactName,
    contactPhone, undertaker,
  } = contract

  const parsedMoney = money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const active = isActive ? style.active : ""


  return (
    <div className={`${className} ${style.container} ${active}`}>
      <span>{contractId}</span>
      <div className={style.name}>
        <span>{clientName}</span>
        <span>{projectName}</span>
      </div>
      <span>{schedule}%</span>
      <span>{parsedMoney}</span>
      <span>{contactName}</span>
      <span>{contactPhone}</span>
      <span>{undertaker}</span>
      <div>
        <IconDetail onClick={onClick} />
      </div>
      {/* hover時左邊的藍色直條 */}
      <div className={style.leftBar} />
    </div>
  )
}