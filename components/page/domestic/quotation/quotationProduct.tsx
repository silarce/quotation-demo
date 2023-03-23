import { useState } from "react"


// components
import DndThead from "./quotationProduct/dndThead"
import ProductList from "./quotationProduct/productList"

// global gear
import AddButton from "components/global/gear/button/addButton"

// css
import style from "./quotationProduct.module.scss"
import styleL from "./local.module.scss"

// type
import type { TuseProduct } from "./hook/useProduct"
import { Class_quotation } from "hooks/quotation/useQuotation"


export default function QuotationProduction({
  classQuotation,
  // mainProductArr,
  // prodCellConfig,
  // activeRow,

  switch02, className = "" }:
  {
    classQuotation: Class_quotation
    // mainProductArr: Class_quotation["mainProductArr"]
    // prodCellConfig: Class_quotation["prodCellConfig"]
    // activeRow: Class_quotation["activeRow"]
    switch02?: boolean

    className?: string
  }) {
  // dnd與資料相關的東西都在這裡面
  // const productStates = useProduct()

  const {
    mainProductArr,
    prodCellConfig,
    activeRow,
    disabled,
    keyList
  } = classQuotation



  const [allowMove, setAllowMove] = useState(false)

  // const { addProduct } = productStates

  const borderRed = switch02 ? style.borderRed : ""

  return (
    <div className={`${style.container} ${borderRed} ${className}`}>
      <div className={styleL.header}>
        <h2>主產品設定</h2>
        <button className={((allowMove && styleL.active) || "")}
          onClick={() => setAllowMove(state => !state)}>
          {allowMove ? "確定排序" : "設定排序"}
        </button>
      </div>
      <div className={style.listContainer}>
        <div className={style.thead}>
          <DndThead
            classQuotation={classQuotation}
            allowMove={allowMove} />
        </div>

        <ProductList
          mainProductArr={mainProductArr}
          activeRow={activeRow}
          prodCellConfig={prodCellConfig}
          disabled={disabled}
        />

        {/* <AddButton className={style.addBtn}
          label="新增產品"
          onClick={addProduct} /> */}
      </div>
    </div>
  )
}








