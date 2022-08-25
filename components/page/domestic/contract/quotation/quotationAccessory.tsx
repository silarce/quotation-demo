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
import type { Taccessory } from "meta/fakeData/fakeQuotation"



export default function QuotationAccessory({ productStates }:
  { productStates: TuseProduct }) {

  const { productList, setProductList, activeRow } = productStates


  const productAccessory = useMemo(() => {
    if (activeRow < 0) return []
    return productList[activeRow].accessory
  }, [activeRow, productList])



  return (
    <>
      <div className={styleL.header}>
        <h2>選配設定</h2>
      </div>
      {/* thead */}
      <div className={styleL.thead}>
        <div className={styleL.rowIndex}>
          <span></span>
        </div>
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
        {/*  */}
        {!productAccessory[0] &&
          <>
            <div className={styleL.rowIndex}></div>
            <span className={styleL.noListTip}>尚未選擇產品</span>
          </>}
        {/*  */}


        {productAccessory.map((row, pIndex) => {
          return (
            <div className={styleL.row} key={pIndex}>
              <div className={styleL.rowIndex}>
                <span>{pIndex + 1}</span>
              </div>

              {theadIndex.map((key, cIndex) => {
                const { width } = theadInfo[key]
                const theStyle = { width }
                let item = row[key]
                // 
                if (item === null) return (
                  <div className={styleL.column} key={cIndex} style={theStyle}>
                    <div><span></span></div>
                  </div>
                )
                // 
                if (typeof item === "string") {
                  // 如果是數值，就加千分位符號
                  const intReg = /^[0-9]*$/
                  const floatReg = /^[+-]?\d+(\.\d+)?$/
                  if (intReg.test(item) || floatReg.test(item))
                    item = item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                  // 改變平方單位的格式
                  const unitReg = /cm2|m2|km2|mm2 /
                  let theTwo;
                  if (unitReg.test(item)) {
                    item = item.replace(/[0-9]/g, '')
                    theTwo = 2
                  }

                  return (
                    <div className={styleL.column} key={cIndex} style={theStyle}>
                      <div>
                        <span>{item}</span>
                        {theTwo && <sup>{theTwo}</sup>}
                      </div>
                    </div>
                  )
                }
                // 
                // const { value, options } = item
                // if (options) {
                //   return (
                //     <div className={styleL.column} key={cIndex} style={theStyle}>
                //       {selectCellCreator({
                //         accessoryIndex: pIndex,
                //         id: key,
                //         productList,
                //         setProductList,
                //         options
                //       })}
                //     </div>
                //   )
                // }
              })}
            </div>
          )
        })}
      </div>
    </>
  )


  // =============
  // pIndex為上層的index
  // function selectCellCreator(
  //   { accessoryIndex, id, productList, setProductList, options }:
  //     {
  //       accessoryIndex: number
  //       id: keyof Taccessory
  //       productList: Tproduct[]
  //       setProductList: Dispatch<SetStateAction<Tproduct[]>>
  //       options: Toption[]
  //     }) {

  //   const accessory = productList[activeRow].accessory[accessoryIndex][id] as { value: string, options: Toption[] }
  //   const stateValue = accessory.value

  //   const onChange = (option: Toption | null) => {
  //     if (!option) return
  //     const { value } = option
  //     setProductList(list => {
  //       const accessory = list[activeRow].accessory[accessoryIndex][id] as { value: string, options: Toption[] }
  //       accessory.value = value
  //       return [...list]
  //     })
  //   }

  //   if (stateValue === undefined) return (<span />)
  //   return <Select03 {...{
  //     stateValue, options, onChange,
  //   }} />
  // } //  selectCellCreator

} //QuotationAccessory


// ================================================

// ================================================
interface TheadInfoItem {
  label: string
  width: string
}

interface TtheadInfo {
  id: TheadInfoItem
  name: TheadInfoItem
  unit: TheadInfoItem
  qty: TheadInfoItem
  listPrice: TheadInfoItem //牌價
  totalListPrice: TheadInfoItem //牌價複價
  price: TheadInfoItem //單價
  totalPrice: TheadInfoItem //複價
}


const theadIndex: (keyof TtheadInfo)[] = [
  "id", "name", "unit", "qty",
  "listPrice", "totalListPrice", "price", "totalPrice",
]


const theadInfo: TtheadInfo = {
  id: { label: "代號", width: "68px" },
  name: { label: "名稱", width: "160px" },
  unit: { label: "單位", width: "40px" },
  qty: { label: "數量", width: "60px" },
  listPrice: { label: "牌價", width: "84px" },
  totalListPrice: { label: "牌價複價", width: "84px" },
  price: { label: "單價", width: "84px" },
  totalPrice: { label: "單價複價", width: "84px" },
}









