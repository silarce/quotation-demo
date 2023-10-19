// 主產品設定
// 主產品設定
// 主產品設定

import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../quotationProduct/dndThead_legacyContract';
import ProductList_legacy from '../quotationProduct/productList_legacy';

import ExchangePanel, { ExchangeRow } from './exchangePanel/exchangePanel';

// global gear
import AddButton from 'components/global/gear/button/addButton';

// css
import scss from '../quotationProduct.module.scss';
import styleL from '../local.module.scss';

// type
import { Class_legacyContract } from 'hooks/quotation/legacy/useLegacyContract';

export default function QuotationProduction({
  legacyContract,
  disabled,
  switch02,
  className = '',
  isAppend,
  isAppending,
}: {
  legacyContract: Class_legacyContract;
  disabled: boolean;
  switch02?: boolean;
  className?: string;
  isAppend?: boolean;
  isAppending?: boolean;
}) {
  // dnd與資料相關的東西都在這裡面
  // const productStates = useProduct()

  const [allowMove, setAllowMove] = useState(false);

  const borderRed = switch02 ? scss.borderRed : '';

  const { prodList: prodList_2, prodSubPriceTotal } = legacyContract;

  const [verticalKeyArr, setVerticalKeyArr] = useState<string[]>([]);
  // console.log(verticalKeyArr);

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
              isAppending={isAppending}
              onVerticalKeyChange={(v) => {
                setVerticalKeyArr(v);
              }}
            />
            {!disabled && (
              <div className={classNames(scss.addBtnWrapper)}>
                <AddButton className={scss.addBtn} label="新增產品" onClick={legacyContract.addProd} />
              </div>
            )}
          </div>

          {isAppend && isAppending && (
            <ExchangePanel>
              {verticalKeyArr.map((key, index) => {
                const prod = prodList_2[key];

                if (!prod) {
                  return null;
                }

                return (
                  <ExchangeRow
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
            </ExchangePanel>
          )}

          {/* main close*/}
        </div>
        {/*  */}
        {/* container close */}
      </div>
      {isAppend && (
        <div className={classNames(scss.total)}>
          <span>合計</span>
          <span>- {prodSubPriceTotal.toLocaleString()}</span>
        </div>
      )}

      {/* wrapper close*/}
    </div>
  );
}

// ======================================================================
