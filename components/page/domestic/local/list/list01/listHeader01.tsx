
import { MouseEvent } from "react";

import { IconDetail } from "public/image/icon/svgComponent/svgIcons"

import style from "./listHeader01.module.scss"

// fakeData
import { Tcontract } from "meta/fakeData/fakeContractList";



export default function ListHeader01(
  { className = "", contract, onClick, isActive }:
    {
      className?: string
      contract: Tcontract
      onClick: ((e: MouseEvent) => void) | (() => void)
      isActive?: boolean
    }) {

  const {
    contractId, clientName, projectName,
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