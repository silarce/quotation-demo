import { useState } from "react"


// components
import DndThead from "./quotationProduct/dndThead"
import ProductList from "./quotationProduct/productList"

// css
import style from "./quotationProduct.module.scss"


// data/hook
import useProduct, { TuseProduct } from "./quotationProduct/useProduct"




export default function QuotationProduction() {
  // dnd與資料相關的東西都在這裡面
  const productStates = useProduct()

  const [allowMove, setAllowMove] = useState(false)


  // console.log(dndProductList)
  

  return (
    <div className={style.container}>
      <div className={style.header}>
        <span>主產品設定</span>
        <button onClick={() => setAllowMove(state => !state)}>
          設定排序
        </button>
      </div>
      <DndThead productStates={productStates} allowMove={allowMove}/>
      <ProductList productStates={productStates} />
      {/* <DndThead theadList={theadList} setDndProductList={setDndProductList} />
      <ProductList dndProductList={dndProductList} /> */}

    </div>
  )
}








