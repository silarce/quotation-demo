

// css
import style from "./panelBody.module.scss"

// fakeData
import { TclientProfile } from "fakeDatabase/client/fakeClientList";


// ====================================================



export default function PanelBody({ clientData }:
  { clientData: TclientProfile }) {

  const { shortName, head, address,
    billAddress, taxtNumber, taxtType, contact } = clientData





  return (
    <div className={style.container}>
      <div className={style.cell01}>
        <div>
          <h6>簡稱</h6>
          <span>{shortName}</span>
        </div>
        <div>
          <h6>公司地址</h6>
          <span>{address}</span>
        </div>
      </div>
      {/*  */}
      <div className={style.cell02}>
        <div>
          <h6>負責人</h6>
          <span>{head}</span>
        </div>
        <div>
          <h6>統一編號</h6>
          <span>{taxtNumber}</span>
        </div>
        <div>
          <h6>扣稅類別</h6>
          <span>{taxtType}</span>
        </div>
        <div>
          <h6>發票地址</h6>
          <span>{billAddress}</span>
        </div>
      </div>
      {/*  */}
      <div className={style.cell03}>
        {contact.map((item, index) => {
          const { name, phone } = item
          if (index === 0) return null
          return (
            <div key={index}>
              <h6>聯絡人 {index + 1} / 電話</h6>
              <span>{name}</span>
              <span> / </span>
              <span>{phone}</span>
            </div>
          )
        })}
      </div>
      {/*  */}
      <div className={style.cell04}></div>
    </div>
  )
}


















