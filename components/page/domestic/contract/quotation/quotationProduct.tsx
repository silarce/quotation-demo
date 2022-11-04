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
import type { TuseProduct_new } from "./hook/useProduct_new"



export default function QuotationProduction({ productStates, switch02, className = "" }:
  {
    productStates: TuseProduct_new
    switch02?: boolean
    className?: string
  }) {
  // dnd與資料相關的東西都在這裡面
  // const productStates = useProduct()

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
        <DndThead productStates={productStates} allowMove={allowMove} />
        <ProductList productStates={productStates} />
        <AddButton className={style.addBtn}
          label="新增產品"
          onClick={() => alert("test")}
        //  onClick={addProduct} 
        />
      </div>
    </div>
  )
}








