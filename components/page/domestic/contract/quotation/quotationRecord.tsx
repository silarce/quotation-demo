

import { TchangeRecord } from "fakeDatabase/domestic/quotation/fakeChangeProductRecord"

// css
import style from "./quotationRecord.module.scss"

// config
import { prodCellConfig } from "fakeDatabase/domestic/quotation/fakeQuotProductionList"


export default function QuotationRecord({ prodChangingRecord }:
  { prodChangingRecord: TchangeRecord }) {

  const { list } = prodChangingRecord
  const recordKeyList = Object.keys(list)

  const {
    keyList: prodKeyList,
    cellConfig,
  } = prodCellConfig

  return (
    <div className={style.container}>
      <div className={style.title}>
        <span>追加 / 追減項目紀錄</span>
        <div>
          <span />
          <span>追加</span>
        </div>
        <div>
          <span />
          <span>追減</span>
        </div>
      </div>

      <div className={style.recordList}>
        {recordKeyList.map((key, index) => {
          let { id, date, priceChange, remark, product }
            = list[key]
          const formatedPriceChange =
            priceChange > 0 ? `+$${priceChange}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : `-$${-priceChange}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          return (
            <div className={style.recordContainer} key={index}>
              <div className={style.recordInfo}>
                <span>{id}</span>
                <span />
                <span>{date}</span>
                <span>{formatedPriceChange}</span>
                <span>{remark}</span>
              </div> {/* recordInfo */}

              <div className={style.prodContainer}>
                <div className={style.thead}>
                  <span></span>
                  <span></span>
                  {prodKeyList.map((key, index) => {
                    const { id, label, width } = cellConfig[key]
                    const theStyle = { width }
                    return (
                      <div className={style.column} key={index} style={theStyle}>
                        <span>{label}</span>
                      </div>
                    )
                  })}
                </div> {/* thead */}
                
                {product.map((item, index) => {
                  const { action } = item
                  const classAction = action === "add" ? style.add
                    : action === "remove" ? style.remove : ""
                  return (
                    <div key={index} className={style.tbody}>
                      <span className={`${style.action} ${classAction}`}></span>
                      <span>{index + 1}</span>
                      {prodKeyList.map((key, index) => {
                        const { width } = cellConfig[key]
                        const value = item[key]
                        const theStyle = { width }
                        return (
                          <div className={style.column} key={index} style={theStyle}>
                            <span>
                              {value}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>  {/* pordContainer */}
            </div> // recordContainer
          )
        })}


      </div>



    </div>
  )
}




