
// tool
import changeNumberMoneyToChinese from "js/tools/numToChineseNum"

// css
import style from "./quotationPdf.module.scss"

// type
import { TuseRemarkList } from "components/page/domestic/quotation/hook/useRemarkList"
import { TuseProduct } from "components/page/domestic/quotation/hook/useProduct"

export default function Total(
  { remarkListState, prodState }:
    {
      remarkListState: TuseRemarkList
      prodState: TuseProduct
    }
) {

  const { remarkList } = remarkListState

  const subTotal = prodState.subTotal
    .toLocaleString(undefined, { maximumFractionDigits: 2 });;
  const businessTax = prodState.businessTax
    .toLocaleString(undefined, { maximumFractionDigits: 2 });
  const total = prodState.total
    .toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className={style.total}>
      <div className={style.remark}>
        <div>
          <span>備註</span>
          <span className={style.semi}>:</span>
        </div>
        <div>
          <ul>
            {remarkList.map((data, index) => {
              const { content } = data
              return (
                <li key={index}>
                  <span>{`(${index + 1})`}</span>
                  <span>{content}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div>
        <div className={style.count}>
          <div>
            <div>
              <span>小</span>
              <span>計</span>
            </div>
            <span>{`(共 ${1} 頁)`}</span>
          </div>
          <div><span>{subTotal}</span></div>
          <div></div>
        </div>

        <div className={style.count}>
          <div>
            <div>
              <span>營業稅5%</span>
            </div>
          </div>
          <div><span>{businessTax}</span></div>
          <div></div>
        </div>

        <div className={style.count}>
          <div>
            <div>
              <span>總</span>
              <span>計</span>
            </div>
            <span>
              新台幣:
            </span>
            <span>{changeNumberMoneyToChinese(total)}元整</span>
            <span>總金額</span>
          </div>
          <div><span>{total}</span></div>
          <div></div>
        </div>
      </div>



    </div>
  )
}

// =======================================================================

















