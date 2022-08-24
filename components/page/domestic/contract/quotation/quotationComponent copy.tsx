import {
  useMemo,
  Dispatch, SetStateAction
} from "react"

// global gear
import Select03, { Toption } from "components/global/gear/select/select03"

// css
import style from "./quotationComponent.module.scss"
import styleL from "./local.module.scss"

// type
import { TuseProduct, Tproduct } from "./hook/useProduct"
import type { Tcomponent } from "meta/fakeData/fakeQuotation"
import { spawn } from "child_process"






export default function QuotationMaterial({ productStates }:
  { productStates: TuseProduct }) {

  const { productList, setProductList, activeRow } = productStates

  // console.log("productList", productList)

  const productComponent = useMemo(() => {
    if (activeRow < 0) return []
    return productList[activeRow].component
  }, [activeRow, productList])

  // console.log(productComponent)

  return (
    <>
      <div className={styleL.header}>
        <h2>材料/配件設定</h2>
      </div>
      {/* thead */}
      <div className={styleL.thead}>
        {theadIndex.map((item, index) => {
          const { label, width } = theadInfo[item]
          const theStyle = { width }
          return (
            <div className={styleL.theadCell} key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
      {/* tbody */}
      <div>
        {productComponent.map((row, pIndex) => {
          return (
            <div className={styleL.row} key={pIndex}>
              {theadIndex.map((key, cIndex) => {
                const value = row[key]
                const { width, options } = theadInfo[key]
                const theStyle = { width }
                // if (value===null) 
                return (
                  <div className={styleL.column} key={cIndex} style={theStyle}>
                    {(options && value !== null)
                      ?
                      selectCellCreator({
                        componentIndex: pIndex,
                        id: key,
                        productList,
                        setProductList,
                        options
                      })
                      : <div><span>{value}</span></div>}
                  </div>
                )
              })}
            </div>
          )
        })}

      </div>

    </>
  )


  // =============
  // pIndex為上層的index
  function selectCellCreator(
    { componentIndex, id, productList, setProductList, options }:
      {
        componentIndex: number
        id: keyof Tcomponent
        productList: Tproduct[]
        setProductList: Dispatch<SetStateAction<Tproduct[]>>
        options: Toption[]
      }) {

    const stateValue = productList[activeRow].component[componentIndex][id]
    const onChange = (option: Toption | null) => {
      if (!option) return
      const { value } = option
      setProductList(list => {
        list[activeRow].component[componentIndex][id] = value
        return [...list]
      })
    }

    if (stateValue === undefined) return (<span />)
    return <Select03 {...{
      stateValue, options, onChange,
    }} />
  } //  selectCellCreator




}


// ================================================

// ================================================
interface TheadInfoItem {
  label: string
  width: string
  options?: Toption[]
}

interface TtheadInfo {
  id01: TheadInfoItem// 代號
  typeName: TheadInfoItem// 種類名稱
  id02: TheadInfoItem // 代號
  material: TheadInfoItem // 材料
  surface: TheadInfoItem // 表面
  basicWeight: TheadInfoItem // 重量基重
  unit: TheadInfoItem // 單位
  qty: TheadInfoItem // 數量
  listPrice: TheadInfoItem // 牌價
  totalListPrice: TheadInfoItem // 牌價複價
  price: TheadInfoItem // 單價
  totalPrice: TheadInfoItem // 複價
}

// interface Tcomponent {
//   id01: string
//   typeName: string
//   id02?: string
//   material?: string
//   surface?: string
//   basicWeight?: string
//   unit?: string
//   qty: string
//   listPrice: string
//   totalListPrice: string
//   price: string
//   totalPrice: string
// }

const theadIndex: (keyof TtheadInfo)[] = [
  "id01", "typeName", "id02", "material",
  "surface", "basicWeight", "unit", "qty",
  "listPrice", "totalListPrice", "price", "totalPrice",
]


const materialOptions: Toption[] = [
  { value: "不鏽鋼304#", label: "不鏽鋼304#" },
  { value: "不鏽鋼316#", label: "不鏽鋼316#" },
  { value: "烤漆鐵", label: "烤漆鐵" },
  { value: "鍍鋅鋼", label: "鍍鋅鋼" },
  { value: "合金鋼", label: "合金鋼" },
  { value: "耐候鋼", label: "耐候鋼" },
  { value: "鋁合金", label: "鋁合金" },
  { value: "陽極鋁合金", label: "陽極鋁合金" },
]
const surfaceOptions: Toption[] = [
  { value: "AA", label: "AA" },
  { value: "BA", label: "BA" },
  { value: "CC", label: "CC" },
  { value: "DS", label: "DS" },
]


const theadInfo: TtheadInfo = {
  id01: { label: "代號", width: "45px" },
  typeName: { label: "種類名稱", width: "136px" },
  id02: { label: "代號", width: "116px" },
  material: { label: "材料", width: "120px", options: materialOptions },
  surface: { label: "表面", width: "50px", options: surfaceOptions },
  basicWeight: { label: "重量基重", width: "75px" },
  unit: { label: "單位", width: "40px" },
  qty: { label: "數量", width: "60px" },
  listPrice: { label: "牌價", width: "82px" },
  totalListPrice: { label: "牌價複價", width: "84px" },
  price: { label: "單價", width: "82px" },
  totalPrice: { label: "複價", width: "84px" },
}









