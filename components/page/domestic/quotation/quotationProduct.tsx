import { useState } from "react"


// components
import DndThead from "./quotationProduct/dndThead"
import ProductList from "./quotationProduct/productList"
import ProductList_legacy from "./quotationProduct/productList_legacy"

// global gear
import AddButton from "components/global/gear/button/addButton"

// css
import style from "./quotationProduct.module.scss"
import styleL from "./local.module.scss"

// type

import { Class_quotation } from "hooks/quotation/useQuotation"



export default function QuotationProduction({
  classQuotation,
  disabled,
  switch02,
  className = "" }:
  {
    classQuotation: Class_quotation
    disabled: boolean
    switch02?: boolean
    className?: string
  }) {
  // dnd與資料相關的東西都在這裡面
  // const productStates = useProduct()


  const [allowMove, setAllowMove] = useState(false)

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

          <ProductList classQuotation={classQuotation as Class_quotation} disabled={disabled} />

        <AddButton className={style.addBtn}
          label="新增產品"
          onClick={classQuotation.addMainProd} />
      </div>
    </div>
  )
}








