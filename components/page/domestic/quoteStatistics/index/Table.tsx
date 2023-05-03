
import { TfakeData } from "pages/domestic/quoteStatistics"
import classNames from "classnames"

// gear
import CellWithBar from "components/global/gear/cell/cellWithBar"

// css
import scss from "./quoteStatistics.module.scss"

export default function Table(
  { fakeDataArr }:
    { fakeDataArr: TfakeData[] }
) {

  return (
    <div className={classNames(scss.table)}>
      <Thead />
      <Tbody dataArr={fakeDataArr} />
      <Tfoot />
    </div>
  )
}

// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================

const Thead = () => {
  return (
    <div className={classNames(scss.row, scss.thead)}>
      {/*  */}
      <div className={classNames(scss.group, scss.group01)}>
        {group01Keys.map((key, index) => {
          let label
          if (index === 0) label = "工程資訊"
          const width = colConfig[key].width

          return (
            <div key={index} style={{ width }}>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      {/*  */}
      <div className={classNames(scss.group, scss.group02)}>
        {group02Keys.map((key, index) => {
          let label
          if (index === 0) label = "客戶資訊"
          const width = colConfig[key].width

          return (
            <div key={index} style={{ width }}>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      {/*  */}
      <div className={classNames(scss.group, scss.group03)}>
        <div><span>捲門</span></div>
        {group03Keys.map((key, index) => {
          const { width, headLabel } = colConfig[key]
          return (
            <div key={index} style={{ width }}>
              <span>{headLabel}</span>
            </div>
          )
        })}
      </div>
      {/*  */}
    </div>
  )
}
// =======================================================================
const Tbody = (
  { dataArr }:
    { dataArr: TfakeData[] }
) => {
  return (
    <div className={scss.tbody}>
      {dataArr.map((data, index) => {
        return (
          <CellWithBar key={index}>
            <div className={scss.row}>
              <div className={classNames(scss.group, scss.group01)}>
                {group01Keys.map((key, index) => {
                  const { label, width } = colConfig[key]
                  const value = data[key]
                  return (
                    <Info key={index} label={label} value={value} width={width} />
                  )
                })}
              </div>
              {/*  */}
              <div className={classNames(scss.group, scss.group02)}>
                {data.customer.map((customer, index) => {
                  return (
                    <div key={index}>
                      {group02Keys.map((key, index) => {
                        const { label, width } = colConfig[key]
                        const value = customer[key]
                        return (
                          <Info key={index} label={label} value={value} width={width} />
                        )
                      })}
                    </div>
                  )
                })}
              </div>
              {/*  */}
              <div className={classNames(scss.group, scss.group03)}>

                {data.customer.map((customer, index) => {
                  return (
                    <div key={index}>
                      {group03Keys.map((key, index) => {
                        const { width } = colConfig[key]
                        const value = customer[key]
                        return (
                          <div key={index} style={{ width }}>
                            <span >{value}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}

              </div>
            </div>
          </CellWithBar>
        )
      })}
    </div>
  )
}
// =======================================================================

const Tfoot = () => {
  return (
    <div className={classNames(scss.row, scss.tfoot)}>
      <div className={classNames(scss.group, scss.group01)}>
        <div className={scss.total}>
          <div>
            <span>總計</span>
          </div>
          <div>
            <span>小計</span>
          </div>
        </div>
      </div>
      <div className={classNames(scss.group, scss.group03)}>
        {group03Keys.map((key, index) => {
          const { label, width } = colConfig[key]
          const value = fakeTotal[key]
          return (
            <div key={index} style={{ width }}>
              <span >{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =======================================================================
const Info = (
  { label, value, width }:
    {
      label: string | undefined
      value: string | undefined
      width: React.CSSProperties["width"]
    }
) => {
  return (
    <div className={scss.info} style={{ width }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
type TconfigKey =
  Exclude<keyof TfakeData | keyof TfakeData["customer"][number], "customer">

type Tconfig = {
  [key in TconfigKey]: {
    label?: string
    headLabel?: string
    width: Exclude<React.CSSProperties["width"], undefined>
    color?: "black" | "colorMain"
  }
}

const group01Keys: Extract<TconfigKey, "idNumber" | "designDepartment" | "constructionName">[] =
  ["idNumber", "designDepartment", "constructionName"]

const group02Keys: Extract<TconfigKey, "customerName" | "contactPerson" | "contactPhone">[] =
  ["customerName", "contactPerson", "contactPhone"]

const group03Keys: Extract<TconfigKey, "listPrice" | "bearPrice" | "percent">[] =
  ["listPrice", "bearPrice", "percent"]

const colConfig: Tconfig = {
  idNumber: {
    label: "編號",
    width: "95px",
    color: "black"
  },
  designDepartment: {
    label: "設計單位",
    width: "100px",
    color: "black"
  },
  constructionName: {
    label: "工程名稱",
    width: "auto",
    color: "black"
  },
  customerName: {
    label: "客戶",
    width: "110px",
    color: "black"
  },
  contactPerson: {
    label: "聯絡人",
    width: "90px",
    color: "black"
  },
  contactPhone: {
    label: "聯絡電話",
    width: "105px",
    color: "black"
  },
  listPrice: {
    label: undefined,
    headLabel: "牌價",
    width: "138px",
    color: "black"
  },
  bearPrice: {
    label: undefined,
    headLabel: "承價",
    width: "138px",
    color: "black"
  },
  percent: {
    label: undefined,
    headLabel: "百分比",
    width: "138px",
    color: "black"
  },
}


const fakeTotal = {
  listPrice: "1,373,614",
  bearPrice: "841,913",
  percent: "60%",
}