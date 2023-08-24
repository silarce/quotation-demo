// 主產品設定
// 主產品設定
// 主產品設定

import { useState } from 'react';
import classNames from 'classnames';

// components
import DndThead from '../quotationProduct/dndThead_legacyContract';
// import ProductList_legacy from '../quotationProduct/productList_legacy';
import ExProductList_legacy from '../quotationProduct/exProductList_legacy';

// global gear
import AddButton from 'components/global/gear/button/addButton';

// css
import scss from '../quotationProduct.module.scss';
import styleL from '../local.module.scss';

// type
import { Class_legacyContract } from 'hooks/quotation/useLegacyContract';

export default function QuotationExProd({
  legacyContract,
  disabled,
  switch02,
  className = '',
}: {
  legacyContract: Class_legacyContract;
  disabled: boolean;
  switch02?: boolean;
  className?: string;
}) {
  // dnd與資料相關的東西都在這裡面

  const [allowMove, setAllowMove] = useState(false);

  const borderRed = switch02 ? scss.borderRed : '';

  const addAdditionalExchange = legacyContract.addExProd;

  let totalPrice = 0;

  Object.values(legacyContract.prodExchangeList).forEach((prod) => {
    // totalPrice += Number(prod.prod.totalPrice);
    totalPrice += Number(prod.prod.totalPrice.replaceAll(',', ''));
  });

  return (
    <div className={scss.wrapper}>
      <div className={`${scss.container} ${borderRed} ${className}`}>
        <div className={styleL.header}>
          <h2>變更 主產品設定</h2>
          <button className={(allowMove && styleL.active) || ''} onClick={() => setAllowMove((state) => !state)}>
            {allowMove ? '確定標題排序' : '設定標題排序'}
          </button>
        </div>
        <div className={scss.main}>
          <div className={scss.listContainer}>
            <div className={scss.thead}>
              <DndThead classQuotation={legacyContract} allowMove={allowMove} isExchange={true} />
            </div>

            <ExProductList_legacy classQuotation={legacyContract as Class_legacyContract} disabled={disabled} />
            <AddButton className={scss.addBtn} label="追加產品" onClick={addAdditionalExchange} />
          </div>

          {/* main close*/}
        </div>
        {/*  */}
        {/* container close */}
      </div>
      {/*  */}
      <div className={classNames(scss.total)}>
        <span>合計</span>
        <span>+ {totalPrice.toLocaleString()}</span>
      </div>
      {/* wrapper close*/}
    </div>
  );
}
