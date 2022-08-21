

// global gear
import Input03 from "components/global/gear/input/input03"


// css
import style from "./productList.module.scss"

// data type
import { TuseProduct } from "./useProduct"

export default function ProductList({ productStates }:
  { productStates: TuseProduct }) {

  const { dndProductList, theadList } = productStates

  return (
    <div className={style.container}>

      {dndProductList.map((row, index) => {
        return (
          <div className={style.row} key={index}>
            {row.map((column, index) => {
              const width = theadList[index].width
              const theStyle = { width }
              return (
                <div className={style.column} style={theStyle} key={index}>
                  <span>{column}</span>
                </div>
              )
            })} {/* column */}
          </div>
        )
      })}{/* row */}

      {/* <Input03 stateValue="" onChange={(e) => console.log(e)} /> */}

    </div>
  )
}