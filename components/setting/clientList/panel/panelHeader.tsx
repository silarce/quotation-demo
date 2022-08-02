import { MutableRefObject, LegacyRef } from "react"

// icon
import iconDelete from "public/image/icon/delete01.svg"
import iconEdit from "public/image/icon/edit.svg"

// css
import style from "./panelHeader.module.scss"

// fakeData
import { TclientProfile } from "meta/fakeData/fakeClientList";

// ====================================================



export default function PanelHeader({ clientData, isActive, clientListRef, index }:
  {
    clientData: TclientProfile
    isActive: boolean
    clientListRef: MutableRefObject<HTMLElement[]>
    index: number
  }) {
  const { id, type, name, phone, fax, contact } = clientData
  const contact01 = contact[0]

  const active = isActive ? style.active : ""

  return (
    <div className={`${style.container} ${active}`}
      ref={
        (ele: HTMLDivElement) => { clientListRef.current[index] = ele }
      }
    >
      <div className={style.cell01}>
        <div>
          <h6>客戶編號</h6>
          <span id="clientId">{id}</span>
        </div>
        <div>
          <h6>類別</h6>
          <span>{type}</span>
        </div>
        <div>
          <h6>全稱</h6>
          <span>{name}</span>
        </div>
      </div>
      {/* ============================ */}
      <div className={style.cell02}>
        <div>
          <h6>公司電話</h6>
          <span>{phone}</span>
        </div>
        <div>
          <h6>公司傳真</h6>
          <span>{fax}</span>
        </div>
      </div>
      {/* ============================ */}
      <div className={style.cell03}>
        <div>
          <h6>聯絡人 1 / 電話</h6>
          <span>{contact01.name}</span>
          <span> / </span>
          <span>{contact01.phone}</span>
        </div>
      </div>
      {/* ============================ */}
      <div className={style.cell04}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconEdit.src} alt="編輯"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconDelete.src} alt="移除" />
        </div>
      </div>
      {/* active時最左邊的紅色直條 */}
      <span className={`${style.redBar} ${active}`} />
    </div>
  )
}


















