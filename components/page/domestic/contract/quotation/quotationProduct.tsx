


// components
import DndThead from "./quotationProduct/dndThead"
import ProductList from "./quotationProduct/productList"

// css
import style from "./quotationProduct.module.scss"


// data/hook
import useProduct, { TuseProduct } from "./quotationProduct/useProduct"




export default function QuotationProduction() {

  const productStates = useProduct()


  // const {
  //   theadList, setTheadList,
  //   dndProductList, setDndProductList
  // } = useProduct()



  // console.log(dndProductList)

  return (
    <div className={style.container}>
      <div className={style.header}>
        <span>主產品設定</span>
        <button>設定排序</button>
      </div>
      <DndThead productStates={productStates} />
      <ProductList productStates={productStates} />
      {/* <DndThead theadList={theadList} setDndProductList={setDndProductList} />
      <ProductList dndProductList={dndProductList} /> */}

    </div>
  )
}








