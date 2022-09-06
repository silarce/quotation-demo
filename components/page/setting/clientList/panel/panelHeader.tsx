import { MouseEvent } from "react"

// icon

import {
  Icondelete01 as IconDelete,
  IconEdit
} from "public/image/icon/svgComponent/svgIcons"


// css
import style from "./panelHeader.module.scss"

// fakeData
import { TclientProfile } from"fakeDatabase/client/fakeClientList";

// ====================================================



export default function PanelHeader(
  { clientData, isActive, editClient, openDeletePanel }:
    {
      clientData: TclientProfile
      isActive: boolean
      editClient: () => void
      openDeletePanel: (e: MouseEvent) => void
    }) {
  const { clientId: id, type, name, phone, fax, contact } = clientData
  const contact01 = contact[0]

  const active = isActive ? style.active : ""

  return (
    <div className={`${style.container} ${active}`}
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
          <IconEdit onClick={editClient} />
          <IconDelete onClick={openDeletePanel}
          />
        </div>
      </div>
      {/* active時最左邊的紅色直條 */}
      <span className={`${style.redBar} ${active}`} />
    </div>
  )
}


















