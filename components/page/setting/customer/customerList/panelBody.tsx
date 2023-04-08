
// css
import style from "../customer.module.scss"

// type
import { TcustomerDto } from "js/api/api_customer";

// ====================================================
export default function PanelBody(
  { customersData }: { customersData: TcustomerDto }) {

  const {
    nickname, contacts
  } = customersData

  let {
    county, district, address,
    invoiceCounty, invoiceDistrict, invoiceAddress
  } = customersData

  county = county ?? ""
  district = district ?? ""
  address = address ?? ""
  invoiceCounty = invoiceCounty ?? ""
  invoiceDistrict = invoiceDistrict ?? ""
  invoiceAddress = invoiceAddress ?? ""

  // ==================================================


  // ==================================================
  return (
    <div className={style.panelBody}>
      <div className={style.cell01}>
        <div>
          <h6>簡稱</h6>
          <span>{nickname}</span>
        </div>
        <div>
          <h6>公司地址</h6>
          <span>{county + district + address}</span>
        </div>
      </div>
      {/*  */}
      <div className={style.cell02}>
        {indexKeys01.map((key, index) => {
          const value = customersData[key]
          const { label } = config01[key]
          return (
            <div key={index}>
              <h6>{label}</h6>
              <span>{value}</span>
            </div>
          )
        })}

        <div>
          <h6>發票地址</h6>
          <span>
            {invoiceCounty + invoiceDistrict + invoiceAddress}
          </span>
        </div>

      </div>
      {/*  */}
      <div className={style.cell03}>
        {contacts?.map((item, index) => {
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

// ==========================================================
// TcustomerDto


type TindexKeys01
  = keyof Pick<TcustomerDto, "principal" | "taxId" | "taxDeductionCategory">

const indexKeys01: TindexKeys01[]
  = ["principal", "taxId", "taxDeductionCategory"]


type Tconfig<indexKeys extends string> = {
  [key in indexKeys]: {
    label: string
  }
}

const config01: Tconfig<TindexKeys01> = {
  principal: {
    label: "負責人"
  },
  taxId: {
    label: "統一編號"
  },
  taxDeductionCategory: {
    label: "扣稅類別"
  },
}














