// tool
import changeNumberMoneyToChinese from 'js/tools/numToChineseNum';

// css
import style from './quotationPdf.module.scss';

type TmemoArr = string[];
type Tsettlement = {
  subTotal: string;
  businessTax: string;
  total: string;
};

export default function Total({ memoArr, settlement }: { memoArr: TmemoArr; settlement: Tsettlement }) {
  memoArr;

  const subTotal = settlement.subTotal;
  const businessTax = settlement.businessTax;
  const total = settlement.total;

  return (
    <div className={style.total}>
      <div className={style.remark}>
        <div>
          <span>備註</span>
          <span className={style.semi}>:</span>
        </div>
        <div>
          <ul>
            {memoArr.map((content, index) => {
              return (
                <li key={index}>
                  {/* <span>{`(${index + 1})`}</span> */}
                  <span>{content}</span>
                </li>
              );
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
          <div>
            <span>{subTotal}</span>
          </div>
          <div></div>
        </div>

        <div className={style.count}>
          <div>
            <div>
              <span>營業稅5%</span>
            </div>
          </div>
          <div>
            <span>{businessTax}</span>
          </div>
          <div></div>
        </div>

        <div className={style.count}>
          <div>
            <div>
              <span>總</span>
              <span>計</span>
            </div>
            <span>新台幣:</span>
            <span>{changeNumberMoneyToChinese(total)}元整</span>
            <span>總金額</span>
          </div>
          <div>
            <span>{total}</span>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

// =======================================================================
