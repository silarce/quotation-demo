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
import { Class_legacyContract } from 'hooks/quotation/legacy/useLegacyContract';

export default function QuotationExProd({
  legacyContract,
  disabled,
  className,
}: {
  legacyContract: Class_legacyContract;
  disabled: boolean;
  className?: string;
}) {
  // dnd與資料相關的東西都在這裡面

  const [allowMove, setAllowMove] = useState(false);

  const addExtraExprod = () => {
    legacyContract.addExtraExProd();
  };

  return (
    <div className={classNames(scss.wrapper)}>
      <div className={classNames(scss.container, scss.exchange, className)}>
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
            <div className={scss.addBtnWrapper}>
              <AddButton className={scss.addBtn} label="追加產品" onClick={addExtraExprod} />
            </div>
          </div>

          {/* main close*/}
        </div>
        {/*  */}
        {/* container close */}
      </div>
      {/*  */}
      <div className={classNames(scss.total, scss.exchange)}>
        <span>合計</span>
        <span>+ {legacyContract.prodExTotal.toLocaleString()}</span>
      </div>
      {/* wrapper close*/}
    </div>
  );
}
