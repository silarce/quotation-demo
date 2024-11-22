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
// 這個元件就是useQuotationProduct實例與UI元件的轉接器，本來就會高度耦合
export default function QuotationProdTable({
  disabled,
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
}) {
  return (
    <div className={scss.prodTable}>
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
                {nodeConfig_itemName.createNode(classProd)}
              </Cell>
            </>
          );

          return (
            <QuotationRow_dnd
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

                const node = createNode(classProd);

                return (
                  <Cell key={cellKey} className={classNames(className)} style={style}>
                    {node}
                  </Cell>
                );
              })}
            </QuotationRow_dnd>
          );
        })}
      </Table_dnd>
    </div>
  );
}
