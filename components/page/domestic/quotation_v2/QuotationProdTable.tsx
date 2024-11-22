import { memo } from 'react';
import _ from 'lodash';

import classNames from 'classnames';

import {
  QuotationRow,
  Cell,
  QuotationRow_dndThead,
  QuotationRow_dnd,
  Table_dnd,
} from 'components/page/domestic/quotation_v2/quotationRow';

// css
import scss from './QuotationProdTable.module.scss';

import { TuseQuotationProductInstance, nodeConfig_origin } from './hook/quotationProduct/useQuotationProduct';

// ===================================================================

// MARK: START

// 這個元件就是useQuotationProduct實例與UI元件的轉接器，本來就會高度耦合
export default function QuotationProdTable({
  disabled,
  className,
  //
  //
  classProdDict,
  activeClassProd,
  //
  cellKeyArr,
  setCellKeyArr,
  prodKeyArr,
  setProdKeyArr,
  //
  choseActiveProd,
}: TuseQuotationProductInstance & {
  disabled: boolean;
  className?: string;
}) {
  // MARK:RENDER
  return (
    <div className={classNames(scss.prodTable, className)}>
      <QuotationRow_dndThead
        disabled={disabled}
        keyArr={cellKeyArr}
        onDragEnd={({ move }) => {
          setCellKeyArr(move(cellKeyArr));
        }}
        configDict={nodeConfig_origin}
        dragHandleInvisible={true}
        left={
          <>
            <Cell
              className={classNames(nodeConfig_origin['itemName'].className)}
              style={nodeConfig_origin['itemName'].style}
            ></Cell>
          </>
        }
      />
      <Table_dnd
        items={prodKeyArr}
        onDragEnd={({ move }) => {
          setProdKeyArr(move(prodKeyArr));
        }}
      >
        {prodKeyArr.map((prodKey, index) => {
          const classProd = classProdDict[prodKey];
          const isActive = activeClassProd === classProd;

          const nodeConfig_itemName = classProd.nodeConfig['itemName'];

          const left = (
            <>
              <Cell className={classNames(nodeConfig_itemName.className)} style={nodeConfig_itemName.style}>
                {nodeConfig_itemName.createNode({
                  disabled,
                  classProd,
                })}
              </Cell>
            </>
          );

          return (
            <QuotationRow_dnd_memo
              //
              rerenderTrigger01={classProd.state}
              rerenderTrigger02={disabled}
              //
              key={prodKey}
              id={prodKey}
              index={index}
              //
              isActive={isActive}
              left={left}
              //
              onDragStart={(e) => {
                choseActiveProd(undefined);
              }}
              onClick={(e) => {
                e.stopPropagation();

                if (!isActive) {
                  choseActiveProd(classProd.state);

                  const handler = () => {
                    choseActiveProd(undefined);
                    window?.removeEventListener('click', handler);
                  };

                  window?.addEventListener('click', handler);
                }
              }}
            >
              {cellKeyArr.map((cellKey, cIndex) => {
                const { style, className, createNode } = classProd.nodeConfig[cellKey];

                const node = createNode({
                  disabled,
                  classProd,
                });

                return (
                  <Cell key={cellKey} className={classNames(className)} style={style}>
                    {node}
                  </Cell>
                );
              })}
            </QuotationRow_dnd_memo>
          );
        })}
      </Table_dnd>
    </div>
  );
}

// MARK:END

// ===================================================================
// ===================================================================

const QuotationRow_dnd_preMemo = (
  params: Parameters<typeof QuotationRow_dnd>[0] & {
    //
    rerenderTrigger01: any;
    rerenderTrigger02: any;
  }
) => {
  const { rerenderTrigger01, rerenderTrigger02, ...rest } = params;

  return <QuotationRow_dnd {...rest} />;
};

const QuotationRow_dnd_memo = memo(QuotationRow_dnd_preMemo, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.isActive === next.isActive &&
    prev.index === next.index &&
    prev.rerenderTrigger01 === next.rerenderTrigger01 &&
    prev.rerenderTrigger02 === next.rerenderTrigger02

    // 把rerenderTrigger設為陣列的方案發生問題
    // _.isEqual(prev.rerenderTrigger, next.rerenderTrigger)
  );
});
