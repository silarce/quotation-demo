import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../quotationProduct/dndThead_legacyContract';
import ProductList_legacy from '../quotationProduct/productList_legacy';

// global gear
import AddButton from 'components/global/gear/button/addButton';

// css
import scss from '../quotationProduct.module.scss';
import styleL from '../local.module.scss';

// type
import { Class_legacyContract } from 'hooks/quotation/useLegacyContract';

export default function QuotationProduction({
  legacyContract,
  disabled,
  switch02,
  className = '',
  isAppend,
}: {
  legacyContract: Class_legacyContract;
  disabled: boolean;
  switch02?: boolean;
  className?: string;
  isAppend?: boolean;
}) {
  // dnd與資料相關的東西都在這裡面
  // const productStates = useProduct()

  const [allowMove, setAllowMove] = useState(false);

  const borderRed = switch02 ? scss.borderRed : '';

  const classProductArr = legacyContract.classProductArr;

  return (
    <div className={scss.wrapper}>
      <div className={`${scss.container} ${borderRed} ${className}`}>
        <div className={styleL.header}>
          <h2>主產品設定</h2>
          <button className={(allowMove && styleL.active) || ''} onClick={() => setAllowMove((state) => !state)}>
            {allowMove ? '確定排序' : '設定排序'}
          </button>
        </div>
        <div className={scss.main}>
          <div className={scss.listContainer}>
            <div className={scss.thead}>
              <DndThead classQuotation={legacyContract} allowMove={allowMove} isAppend={isAppend} />
            </div>

            <ProductList_legacy
              classQuotation={legacyContract as Class_legacyContract}
              disabled={disabled}
              isAppend={isAppend}
            />
            {!disabled && <AddButton className={scss.addBtn} label="新增產品" onClick={legacyContract.addProd} />}
          </div>

          {isAppend && (
            <div className={scss.right}>
              <div className={classNames(scss.header, styleL.thead)}>
                <div className={classNames(styleL.theadCell)}>
                  <span>原數量</span>
                </div>
                <div className={classNames(styleL.theadCell)}>
                  <span>追減</span>
                </div>
                <div className={classNames(styleL.theadCell)}>
                  <span>變更</span>
                </div>
                <div className={classNames(styleL.theadCell)}>
                  <span>追減/變更金額</span>
                </div>
              </div>

              <div className={classNames(scss.tbody)}>
                {/* row1 */}
                {classProductArr.map((prod, index) => {
                  return (
                    <ChangeListRow
                      key={index}
                      oriQty={prod.quantity}
                      reduce={prod.reduceQty}
                      reduceOnChange={(v) => {
                        prod.reduceQty = v;
                      }}
                      exchange={prod.exchangeQty}
                      changedMoney={prod.reduceExchangePrice}
                    />
                  );
                })}
                {/*  */}
              </div>
            </div>
          )}

          {/* main close*/}
        </div>
        {/*  */}
        {/* container close */}
      </div>
      {isAppend && (
        <div className={classNames(scss.total)}>
          <span>合計</span>
          <span>{'-255,000'}</span>
        </div>
      )}

      {/* wrapper close*/}
    </div>
  );
}

// ======================================================================
const ChangeListRow = ({
  oriQty,
  reduce,
  reduceOnChange,
  exchange,
  changedMoney,
}: {
  oriQty: number | string;
  reduce: number | string;
  reduceOnChange: (v: string) => void;
  exchange: number | string;
  changedMoney: number | string;
}) => {
  return (
    <div className={scss.row}>
      <span>{oriQty}</span>
      <div className={scss.inputBox}>
        <span>-</span>
        <input
          type="number"
          value={reduce ?? ''}
          onFocus={() => reduceOnChange('0')}
          onChange={(e) => {
            reduceOnChange(e.target.value);
          }}
        />
      </div>
      <span>- {exchange}</span>
      <span>- {changedMoney}</span>
    </div>
  );
};
