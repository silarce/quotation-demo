import { useState } from "react"


// components
import DndThead from "./quotationProduct/dndThead"
import ProductList from "./quotationProduct/productList"

// global gear
import AddButton from "components/global/gear/button/addButton"

// css
import style from "./quotationProduct.module.scss"


// data/hook
import useProduct, { TuseProduct } from "./quotationProduct/useProduct"




export default function QuotationProduction() {
  // dnd與資料相關的東西都在這裡面
  const productStates = useProduct()

  const [allowMove, setAllowMove] = useState(false)


  const { addProduct } = productStates

  return (
    <div className={style.container}>
      <div className={style.header}>
        <span>主產品設定</span>
        <button onClick={() => setAllowMove(state => !state)}>
          設定排序
        </button>
      </div>
      <DndThead productStates={productStates} allowMove={allowMove} />
      <ProductList productStates={productStates} />

      <AddButton className={style.addBtn}
        label="新增產品" onClick={addProduct} />

    </div>
  )
}








