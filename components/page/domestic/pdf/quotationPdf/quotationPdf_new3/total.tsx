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

export type { TmemoArr, Tsettlement };

export default function Total({
  //
  page,
  totalPage,
  memoArr,
  settlement,
  subTotal_page,
}: {
  page: number;
  totalPage: number;
  memoArr: TmemoArr;
  settlement: Tsettlement;
  subTotal_page?: string;
}) {
  const isLatestPage = page === totalPage;

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
            {isLatestPage && (
              <>
                <div>
                  <span>小</span>
                  <span>計</span>
                </div>
                <span>{`(共 ${totalPage} 頁)`}</span>
              </>
            )}
            {!isLatestPage && (
              <>
                <div>
                  <span>本</span>
                  <span>頁</span>
                  <span>合</span>
                  <span>計</span>
                </div>
              </>
            )}
          </div>
          <div>
            <span>{isLatestPage ? subTotal : subTotal_page}</span>
          </div>
          <div></div>
        </div>

        <div className={style.count}>
          <div>
            <div>{isLatestPage && <span>營業稅5%</span>}</div>
          </div>
          <div>
            <span>{isLatestPage ? businessTax : '　'}</span>
          </div>
          <div></div>
        </div>

        <div className={style.count}>
          <div>
            {isLatestPage && (
              <>
                <div>
                  <span>總</span>
                  <span>計</span>
                </div>
                <span>新台幣:</span>
                <span>{changeNumberMoneyToChinese(total)}元整</span>
                <span>總金額</span>
              </>
            )}
            {!isLatestPage && (
              <>
                <div>
                  <span>　</span>
                </div>
                <span>　</span>
                <span>　</span>
                <span>　</span>
              </>
            )}
          </div>
          <div>
            <span>{isLatestPage ? total : '　'}</span>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

// =======================================================================
