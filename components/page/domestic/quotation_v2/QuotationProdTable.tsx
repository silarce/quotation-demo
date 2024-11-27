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

import {
  TuseQuotationProductInstance,
  nodeConfig_origin,
  nodeConfig_component_origin,
} from './hook/quotationProduct/useQuotationProduct';
import { IdcardFilled } from '@ant-design/icons';

// ===================================================================

// MARK: START

// 這個元件就是useQuotationProduct實例與UI元件的轉接器，本來就會高度耦合
export default function QuotationProdTable({
  disabled,
  className,
  //
  //
  classProdDict,
  activedClassProd: activeClassProd,
  //
  cellKeyArr,
  setCellKeyArr,
  prodKeyArr,
  setProdKeyArr,
  //
  choseActiveProd,
  //
  activedClassComponentArr,
  activedClassComponentDict,
  cellKeyArr_component,
  setCellKeyArr_component,
  componentKeyArr,
  setComponentKeyArr,
}: TuseQuotationProductInstance & {
  disabled: boolean;
  className?: string;
}) {
  // MARK:RENDER
  return (
    <>
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
              >
                {nodeConfig_origin['itemName'].label}
              </Cell>
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
                rerenderTrigger03={cellKeyArr}
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
                  choseActiveProd(classProd.state);

                  // if (!isActive) {
                  //   choseActiveProd(classProd.state);

                  //   const handler = () => {
                  //     choseActiveProd(undefined);
                  //     window?.removeEventListener('click', handler);
                  //   };

                  //   window?.addEventListener('click', handler);
                  // }
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

      <br />

      <div className={scss.prodComponent}>
        <QuotationRow_dndThead
          disabled={disabled}
          keyArr={cellKeyArr_component}
          onDragEnd={({ move }) => {
            setCellKeyArr_component(move(cellKeyArr_component));
          }}
          configDict={nodeConfig_component_origin}
          dragHandleInvisible={true}
          left={
            <>
              <Cell
                className={classNames(nodeConfig_component_origin['name'].className)}
                style={nodeConfig_component_origin['name'].style}
              >
                {nodeConfig_component_origin['name'].label}
              </Cell>
            </>
          }
        />
        <Table_dnd
          items={componentKeyArr ?? []}
          onDragEnd={({ move }) => {
            if (!componentKeyArr) {
              return;
            }

            setComponentKeyArr(move(componentKeyArr));
          }}
        >
          {componentKeyArr?.map((componentKey, index) => {
            if (!activedClassComponentDict) {
              return null;
            }

            const classComponent = activedClassComponentDict[componentKey];

            if (!classComponent) {
              return null;
            }

            const nodeConfig_itemName = classComponent.nodeConfig['name'];

            const left = (
              <>
                <Cell className={classNames(nodeConfig_itemName.className)} style={nodeConfig_itemName.style}>
                  {nodeConfig_itemName.createNode({
                    disabled,
                    classComponent: classComponent,
                  })}
                </Cell>
              </>
            );

            return (
              <QuotationRow_dnd_memo
                //
                rerenderTrigger01={classComponent.state}
                rerenderTrigger02={disabled}
                rerenderTrigger03={cellKeyArr_component}
                //
                key={componentKey}
                id={componentKey}
                index={index}
                //
                // isActive={isActive}
                left={left}
                //
                // onDragStart={(e) => {
                //   choseActiveProd(undefined);
                // }}
              >
                {cellKeyArr_component.map((cellKey, cIndex) => {
                  const { style, className, createNode } = classComponent.nodeConfig[cellKey];

                  const node = createNode({
                    disabled,
                    classComponent: classComponent,
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
      {/* QuotationRow */}
      {/* {activedClassComponentArr?.map((classComponent, index) => {
        if (!classComponent) {
          return null;
        }

        const { nodeConfig } = classComponent;

        return (
          <QuotationRow key={index}>
            {cellKeyArr_component.map((cellKey) => {
              const { style, className, createNode } = nodeConfig[cellKey];
              const node = createNode({
                disabled,
                classComponent,
              });

              return (
                <Cell key={cellKey} className={classNames(className)} style={style}>
                  {node}
                </Cell>
              );
            })}
          </QuotationRow>
        );
      })} */}
    </>
  );
}

// MARK:END

// ===================================================================
// ===================================================================

const QuotationRow_dnd_preMemo = (
  params: Parameters<typeof QuotationRow_dnd>[0] & {
    //
    rerenderTrigger01?: any;
    rerenderTrigger02?: any;
    rerenderTrigger03?: any;
  }
) => {
  const { rerenderTrigger01, rerenderTrigger02, rerenderTrigger03, ...rest } = params;

  return <QuotationRow_dnd {...rest} />;
};

const QuotationRow_dnd_memo = memo(QuotationRow_dnd_preMemo, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.isActive === next.isActive &&
    prev.index === next.index &&
    prev.rerenderTrigger01 === next.rerenderTrigger01 &&
    prev.rerenderTrigger02 === next.rerenderTrigger02 &&
    prev.rerenderTrigger03 === next.rerenderTrigger03

    // 把rerenderTrigger設為陣列的方案發生問題
    // _.isEqual(prev.rerenderTrigger, next.rerenderTrigger)
  );
});
