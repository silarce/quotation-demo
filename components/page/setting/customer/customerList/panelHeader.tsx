
import { useRouter } from "next/router";


import { MouseEvent } from "react"

// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar";


// icon
import {
  IconDelete01 as IconDelete,
  IconEdit
} from "public/image/icon/svgComponent/svgIcons"


// css
import style from "../customer.module.scss"

// type
import { TcustomerDto, Tcontacts } from "js/api/api_customer";






// ====================================================



export default function PanelHeader(
  { customersData, isActive, openDelPanel }:
    {
      customersData: TcustomerDto
      isActive: boolean
      openDelPanel: (e: MouseEvent, data: TcustomerDto) => void
    }) {
  // ====================================================
  const router = useRouter()

  // ====================================================
  const contact01
    = customersData.contacts?.[0] ?? {} as Partial<Tcontacts>
  // ====================================================

  const toEdit = (e: MouseEvent) => {
    e.stopPropagation()
    router.push(`/setting/customer/edit/${customersData.id}`)
  }

  // ====================================================
  return (
    <CellWithBar isActive={isActive}>
      <div className={`${style.panelHeader}`}
      >
        <div className={style.cell01}>
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
        </div>
        {/* ============================ */}
        <div className={style.cell02}>
          {indexKeys02.map((key, index) => {
            const value = customersData[key]
            const { label } = config02[key]
            return (
              <div key={index}>
                <h6>{label}</h6>
                <span>{value}</span>
              </div>
            )
          })}
        </div>
        {/* ============================ */}
        <div className={style.cell03}>
          <div>
            <h6>聯絡人 1 / 電話</h6>
            <span>{contact01.name || ""}</span>
            <span> / </span>
            <span>{contact01.phone || ""}</span>
          </div>
        </div>
        {/* ============================ */}
        <div className={style.cell04}>
          <div>
            <IconEdit onClick={toEdit} />
            <IconDelete onClick={(e) => openDelPanel(e, customersData)} />
          </div>
        </div>
      </div>
    </CellWithBar>
  )
}

// ===========================================================



// TcustomerDto
type TindexKeys01
  = keyof Pick<TcustomerDto, "customerNumber" | "category" | "name">
type TindexKeys02
  = keyof Pick<TcustomerDto, "phone" | "fax">

const indexKeys01: TindexKeys01[]
  = ["customerNumber", "category", "name"]
const indexKeys02: TindexKeys02[]
  = ["phone", "fax"]

type Tconfig<indexKeys extends string> = {
  [key in indexKeys]: {
    label: string
  }
}

const config01: Tconfig<TindexKeys01> = {
  customerNumber: {
    label: "客戶編號"
  },
  category: {
    label: "客戶類型"
  },
  name: {
    label: "客戶全稱"
  },
}
const config02: Tconfig<TindexKeys02> = {
  phone: {
    label: "公司電話"
  },
  fax: {
    label: "公司傳真"
  },
}












