import Image from "next/image"
import classNames from "classnames"



import iconCheck from "public/image/icon/check.svg"


// css
import scss from "./reportTable.module.scss"



export default function ReportTable(
  { reportDetailArr }:
    { reportDetailArr: TreportDetail[] }
) {


  return (
    <div className={classNames(scss.table)}>
      {/*  */}
      <div className={classNames(scss.thead)}>
        {keyArr.map(key => {
          const { label, width, flex } = config[key]
          if (key === "purpose") {
            return (
              <div key={key} className={classNames(scss.purposeColumn)} style={{ width }}>
                <div><span>{label}</span></div>
                <div>
                  {purposeKeyArr.map(key => {
                    const { label, width } = config[key]
                    return (
                      <div key={key} className={classNames()} style={{ width }}>
                        <span>{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }
          // 
          return (
            <div key={key} className={classNames()} style={{ width, flex }}>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      {/*  */}

      <div className={classNames(scss.tbody)}>

        {reportDetailArr.map((data, index) => {
          return (
            <div key={index} className={classNames(scss.row)}>
              {keyArr.map((key) => {
                const value = data[key]
                const { label, width } = config[key]
                // -----
                if (key === "purpose") {
                  const purposeValue = data[key]
                  return purposeKeyArr.map((purposeKey) => {
                    const value = purposeValue[purposeKey]

                    const { width } = config[purposeKey]
                    return (
                      <div key={purposeKey} className={scss.check}
                        style={{ width }}>
                        {value && <Image src={iconCheck} alt="check" />}
                      </div>
                    )
                  })
                }
                // -----
                return (
                  <div key={key} style={{ width }}>
                    <span>{value as string}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
// =================================================================

type TreportDetail = {
  period: string
  customerName: string
  contactPerson: string
  purpose: {
    openUp: boolean // 開拓
    valuation: boolean // 估價
    contract: boolean // 訂約
    collectMoney: boolean // 收款
    serve: boolean // 服務
  }
  content: string
}

type Tkeys = keyof TreportDetail
type TpurposeKeys = keyof TreportDetail["purpose"]

type Tconfig = {
  [key in (Tkeys | TpurposeKeys)]: {
    label: string
    width: React.CSSProperties["width"]
    // position?: "left" | "center"
    color?: "black" | "main"
    flex?: "auto"
  }
}


const keyArr: Tkeys[] = [
  "period", "customerName", "contactPerson", "purpose", "content",
]
const purposeKeyArr: TpurposeKeys[] = [
  "openUp", "valuation", "contract", "collectMoney", "serve",
]


const config: Tconfig = {
  period: {
    label: "上午/下午",
    width: "104px",
  },
  customerName: {
    label: "客戶名稱",
    width: "163px",
  },
  contactPerson: {
    label: "接洽人",
    width: "147px",
  },
  purpose: {
    label: "工作項目",
    width: "auto",
    // position: "center",
    color: "main"
  },
  openUp: {
    label: "開拓",
    width: "50px",
  },
  valuation: {
    label: "估價",
    width: "50px",
  },
  contract: {
    label: "訂約",
    width: "50px",
  },
  collectMoney: {
    label: "收款",
    width: "50px",
  },
  serve: {
    label: "服務",
    width: "50px",
  },

  content: {
    label: "工作內容",
    width: "auto",
    flex: "auto"
  },

}

