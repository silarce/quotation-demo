// css
// import style from "./quotationComponent.module.scss"
import styleL from './local.module.scss';

// type
// import { TuseProduct } from  "./hook/useProduct"

// fake
import { fakeAccessoryListOri } from 'fakeDatabase/domestic/quotation/fakeQuotAccessoryList';

export default function QuotationAccessory({ activeRow }: { activeRow: number }) {
  const productAccessory = fakeAccessoryListOri();

  // const productAccessory = useMemo(() => {
  //   if (activeRow < 0) return []
  //   return productList[activeRow].accessory
  // }, [activeRow, productList])

  return (
    <>
      <div className={styleL.header}>
        <h2>選配設定</h2>
      </div>
      {/* thead */}
      <div className={styleL.thead}>
        <div className={styleL.rowIndex}>
          <span></span>
        </div>
        {theadIndex.map((item, index) => {
          const { label, width } = theadInfo[item];
          const theStyle = { width };

          return (
            <div className={styleL.theadCell} key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      {/* tbody */}

      <div>
        {activeRow === -1 && (
          <>
            <div className={styleL.rowIndex}></div>
            <span className={styleL.noListTip}>尚未選擇產品</span>
          </>
        )}
        {/*  */}

        {activeRow > -1 &&
          productAccessory.map((row, pIndex) => {
            return (
              <div className={styleL.row} key={pIndex}>
                <div className={styleL.rowIndex}>
                  <span>{pIndex + 1}</span>
                </div>

                {theadIndex.map((key, cIndex) => {
                  const { width } = theadInfo[key];
                  const theStyle = { width };
                  let item = row[key];

                  //
                  if (item === null) {
                    return (
                      <div className={styleL.column} key={cIndex} style={theStyle}>
                        <div>
                          <span></span>
                        </div>
                      </div>
                    );
                  }

                  //
                  if (typeof item === 'string') {
                    // 如果是數值，就加千分位符號
                    const intReg = /^[0-9]*$/;
                    const floatReg = /^[+-]?\d+(\.\d+)?$/;

                    if (intReg.test(item) || floatReg.test(item)) {
                      item = item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    }

                    // 改變平方單位的格式
                    const unitReg = /cm2|m2|km2|mm2 /;
                    let theTwo;

                    if (unitReg.test(item)) {
                      item = item.replace(/[0-9]/g, '');
                      theTwo = 2;
                    }

                    return (
                      <div className={styleL.column} key={cIndex} style={theStyle}>
                        <div>
                          <span>{item}</span>
                          {theTwo && <sup>{theTwo}</sup>}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
      </div>
    </>
  );
} //QuotationAccessory

// ================================================
interface TheadInfoItem {
  label: string;
  width: string;
}

interface TtheadInfo {
  id: TheadInfoItem;
  name: TheadInfoItem;
  unit: TheadInfoItem;
  qty: TheadInfoItem;
  listPrice: TheadInfoItem; //牌價
  totalListPrice: TheadInfoItem; //牌價複價
  price: TheadInfoItem; //單價
  totalPrice: TheadInfoItem; //複價
}

const theadIndex: (keyof TtheadInfo)[] = [
  'id',
  'name',
  'unit',
  'qty',
  'listPrice',
  'totalListPrice',
  'price',
  'totalPrice',
];

const theadInfo: TtheadInfo = {
  id: { label: '代號', width: '68px' },
  name: { label: '名稱', width: '160px' },
  unit: { label: '單位', width: '40px' },
  qty: { label: '數量', width: '60px' },
  listPrice: { label: '牌價', width: '84px' },
  totalListPrice: { label: '牌價複價', width: '84px' },
  price: { label: '單價', width: '84px' },
  totalPrice: { label: '單價複價', width: '84px' },
};
