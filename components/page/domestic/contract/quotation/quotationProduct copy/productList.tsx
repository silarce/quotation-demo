




// css
import style from "./productList.module.scss"

// data type
import { theadList } from "./useProduct"



export default function ProductList({ dndProductList }:
  { dndProductList: string[][] }) {


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


    </div>
  )
}